import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as faker from 'faker';
import Promise from "ts-promise";
import * as express from "express";
import * as expressPouchdb from "express-pouchdb";
import * as mysql from "mysql";

import { Customers } from "../src/collections/Customers";
import {CustomerCards} from "../src/collections/CustomerCards";
import {Orders} from "../src/collections/Orders";
import {OrderItems} from "../src/collections/OrderItems";
import {OrderTags} from "../src/collections/OrderTags";
import {OrderCharges} from "../src/collections/OrderCharges";
import {Deliveries} from "../src/collections/Deliveries";

import {Customer} from "../src/entities/Customer";
import {CustomerCard} from "../src/entities/CustomerCard";
import {Order} from "../src/entities/Order";
import {OrderItem} from "../src/entities/OrderItem";
import {OrderTag} from "../src/entities/OrderTag";
import {OrderCharge} from "../src/entities/OrderCharge";
import {Delivery} from "../src/entities/Delivery";
import { Database } from '../src/access/Database';

var config = {
	"port": 5555,
	"pouchURL": "http://localhost:5555/mocks",
	"mocks": true
}

var app;
var pouch;
var customers, customer_cards, orders, deliveries, order_items, order_tags, order_charges;
var SQLconnection;

connectPouch();
connectSQL();
copyPouchToSQL();


function connectPouch(){
	app = express();
	app.use('/', expressPouchdb(PouchDB));
	app.listen(config.port);
	pouch = new PouchDB(config.pouchURL);

	customers = new Customers(pouch, Customer);
	customer_cards = new CustomerCards(pouch, CustomerCard);
	orders = new Orders(pouch, Order);
	deliveries = new Deliveries(pouch, Delivery);
	order_items = new OrderItems(pouch, OrderItem);
	order_tags = new OrderTags(pouch, OrderTag);
	order_charges = new OrderCharges(pouch, OrderCharge);
}

function connectSQL(){
	SQLconnection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'pouch',
	  multipleStatements: true
	});

	SQLconnection.connect(function(err) {
	  if (err) {
	    console.error('error connecting to mysql: ' + err.stack);
	    return;
	  }
 
	  console.log('connected to mysql');
	  SQLconnection.query('DELETE FROM etl_customers; DELETE FROM etl_customer_cards;', function (error, results, fields) {
		if (error) throw error;     
	  });
	});
}


function copyPouchToSQL(){
	pouch.info().then(function (info, done) {
	    let t = this;
	    let ps = [];
	//Only add hardcoded mock if addMocks is true at top
	    if (config.mocks){
	    	ps.push(hardcodedMock());
	    }
	    Promise.all(ps).then(()=> {
	    	console.log("before finding customer");
	      return customers.find("name", "", {startsWith: true});
	    }).then((cs) => {
	    	console.log(cs);
	//1. Copy customers from pouch to sql    	
	    	_.each(cs, function(customer){
	    		console.log(customer)
		    	let cus  = {id                    :customer.id,  
	                        mobile                :customer.mobile,  
	                        name                  :customer.name,  
	                        email                 :customer.email,  
	                        autocomplete          :customer.autocomplete,  
	                        street_num            :customer.street_num,  
	                        street_route          :customer.street_route,  
	                        apartment             :customer.apartment,  
	                        city                  :customer.city,  
	                        state                 :customer.state,  
	                        zip                   :customer.zip,  
	                        lat                   :customer.lat,  
	                        lng                   :customer.lng,  
	                        delivery_notes        :customer.delivery_notes,  
	                        cleaning_notes        :customer.cleaning_notes,  
	                        payment_customer_token:customer.payment_customer_token,  
	                        payment_customer_id:customer.payment_customer_id,
	                        is_doorman: customer.is_doorman ? 1 : 0
	            };

	           
				var query = SQLconnection.query('INSERT INTO etl_customers SET ?', cus, function (error, results, fields) {
			        if (error) throw error;
		   		});
			});
			return customer_cards.find("customer_id", "", {startsWith: true});
		}).then((crds) => {
			let amount = crds.length;
			let i = 0;
	//2. Copy customer cards from pouch to sql  
			_.each(crds, function(card){
				let crd = {id : card.id,
					customer_id : card.customer_id,
					card_id : card.card_id,
					brand : card.brand,
					last4 : card.last4,
					is_default: card.is_default ? 1 : 0
				}

				var query = SQLconnection.query('INSERT INTO etl_customer_cards SET ?', crd, function (error, results, fields) {
				    console.log(error);
				    console.log(results);
				    console.log(fields);
				    if (error) throw error;
				    i++;
				    if (i == amount) {
				    	disconnectSQL();
				    	if (config.mocks){
				    		destroyPouch();
				    	}
				    }
			   	});
			});
	      done();
	    }).catch(_.noop);
  	});
}


   

function disconnectSQL() {
	SQLconnection.destroy();
}

function destroyPouch(done: Function) {
    pouch.destroy(() => done());
}



//***********
//
//Mocks
function hardcodedMock(){
	return new Promise((res, rej) => {
  		let t = this;
  		let customerObj= {
		    mobile: "19173411892",
		    name: "Jay Shmoe",
		    email: "hbarr@gmail.com",
		    autocomplete: "199 Orchard St, New York, NY 10002, USA",
		    street_num: "199",
		    street_route: "Orchard Street",
		    apartment: "2D",
		    city: "New York",
		    state: "NY",
		    zip: "10002",
		    lat: "40.72224",
		    lng: "-73.988152",
		    delivery_notes: "Ring bell twice",
		    cleaning_notes: "Clean slowly",
		    payment_customer_id: "cus_difif_29392",
		    payment_customer_token: "tok_f9f9f_dodod"
 	    };
		let customerDefaultCardObj = {
	     card_id: "card_xkff_fifo",
	     brand: "Visa",
	     last4: "4242",
	     is_default: false
	   };

	   let customerSecondCardObj = {
	     card_id: "card_xg3f_hhh",
	     brand: "Visa",
	     last4: "0341",
	     is_default: true
	   };

	   let orderObj = {
	     readable_id: faker.random.uuid(),
	     due_datetime: new Date().getTime(),
	     rack: "222",
	     notes: "Please do quickly",
	     tax: faker.commerce.price(),
	     tip: faker.commerce.price(),
	     discount_fixed: 5.00,
	     balance: faker.commerce.price(),
	     all_ready: true,
	     all_pickedup: true,
	     delivery_pickup_id: "del_" + faker.random.uuid(),
	     delivery_dropoff_id: "del_" + faker.random.uuid() 
	   };

	   let deliveryPickupObj = {
	     is_pickup: true,
	     delivery_time: new Date().getTime(),
	     delivery_person: faker.name.findName(),
	     is_confirmed: true
	   }

	   let deliveryDropoffObj = {
	     is_pickup: false,
	     delivery_time: new Date().getTime(),
	     express_id: "del_" + faker.random.uuid()
	   }

	  let orderItem1Obj = {
	     item_id: "1234",
	     total_price: faker.commerce.price(),
	     name: "Washfold",
	     quantity: faker.random.number(),
	     notes: "Clean hard",
	     separate: true,
	     wash: true,
	     detergent: "Tide"
	   };

	   let orderItem2Obj = {
	     item_id: "2a2a",
	     total_price: faker.commerce.price(),
	     name: "Pants",
	     quantity: faker.random.number(),
	     dry: true,
	     color: faker.commerce.color()
	   };

	   let orderItem3Obj = {
	     item_id: "2a2a",
	     total_price: faker.commerce.price(),
	     name: "Skirts",
	     quantity: faker.random.number(),
	     dry: true,
	     color: faker.commerce.color(),
	     brand: "Zara",
	     pattern: "zebra",
	     alteration_type: "Sew zipper"
	   };

	   let orderTagObj = {
	     tag_number: faker.random.number()
	   };

	   let orderChargeObj = {
	     amount: faker.commerce.price(),
	     charge_id: "ch_" + faker.random.uuid()
	   };

    //Insert customer
    customers.insert(customerObj).then((cust) => {
      customerDefaultCardObj["customer_id"] = cust.id; 
      customerSecondCardObj["customer_id"] = cust.id; 
      orderObj["customer_id"] = cust.id; 
      deliveryPickupObj["customer_id"] = cust.id; 
      deliveryDropoffObj["customer_id"] = cust.id; 
//Insert default card      
      return customer_cards.insert(customerDefaultCardObj); 
    }).then((cust_default_card) => {
       orderChargeObj["card_id"] = cust_default_card.id;
//Insert second card       
       return customer_cards.insert(customerSecondCardObj); 
    }).then((cust_second_card) => {
//Insert delivery pickup      
      return deliveries.insert(deliveryPickupObj);
     }).then((delivPickup) => {  
//Insert order
      return orders.insert(orderObj);
    }).then((ord) => {
      orderItem1Obj["order_id"] = ord.id; 
      orderItem2Obj["order_id"] = ord.id; 
      orderItem3Obj["order_id"] = ord.id; 
      orderTagObj["order_id"] = ord.id; 
      orderChargeObj["order_id"] = ord.id;
//Insert order item 1      
      return order_items.insert(orderItem1Obj);
    }).then((ord_item_1) => {
//Insert order item 2
      return order_items.insert(orderItem2Obj);
    }).then((ord_item_2) => {
//Insert order item 3
      return order_items.insert(orderItem3Obj);
    }).then((ord_item_3) => {
//Insert 3 order tags      
      return order_tags.insert(orderTagObj);
    }).then((ord_tag1) => {
      return order_tags.insert(orderTagObj);
    }).then((ord_tag2) => {
      return order_tags.insert(orderTagObj);
    }).then((ord_tag3) => {
//Insert order charge
      return order_charges.insert(orderChargeObj);
    }).then((ord_charge) => {
//Insert delivery dropoff      
      return deliveries.insert(deliveryDropoffObj);
     }).then((delivDropoff) => {  
       return res(true);
    }).catch(function(m){
      console.log(m);
      console.log("Error in testWorkflow");
      return rej(new Error("Error"));
    });
   });
}



