import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as faker from 'faker';
import Promise from "ts-promise";
import * as express from "express";
import * as expressPouchdb from "express-pouchdb";
import * as mysql from "mysql";

import { Customers } from "../src/collections/Customers";
import { CustomerCards } from "../src/collections/CustomerCards";
import { Orders } from "../src/collections/Orders";
import { OrderItems } from "../src/collections/OrderItems";
import { OrderTags } from "../src/collections/OrderTags";
import { OrderCharges } from "../src/collections/OrderCharges";
import { Deliveries } from "../src/collections/Deliveries";

import { Customer } from "../src/entities/Customer";
import { CustomerCard } from "../src/entities/CustomerCard";
import { Order } from "../src/entities/Order";
import { OrderItem } from "../src/entities/OrderItem";
import { OrderTag } from "../src/entities/OrderTag";
import { OrderCharge } from "../src/entities/OrderCharge";
import { Delivery } from "../src/entities/Delivery";
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


function connectPouch() {
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

function connectSQL() {
	SQLconnection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'pouch',
		multipleStatements: true
	});

	SQLconnection.connect(function(err) {
		if (err) {
			console.error('error connecting to mysql: ' + err.stack);
			return;
		}

		console.log('connected to mysql');
		SQLconnection.query('DELETE FROM etl_customers; DELETE FROM etl_customer_cards; DELETE FROM etl_orders; DELETE FROM etl_order_items; DELETE FROM etl_order_tags; DELETE FROM etl_order_charges; DELETE FROM etl_deliveries;'
			, function(error, results, fields) {
				if (error) throw error;
			});
	});
}


function copyPouchToSQL() {
	pouch.info().then(function(info, done) {
		let t = this;
		let ps = [];
		//Only add hardcoded mock if addMocks is true at top
		if (config.mocks) {
			_.times(4, function(){
      			ps.push(mock());
    		})
			ps.push(hardcodedMock());
		}
		Promise.all(ps).then(() => {
			return customers.find("name", "", { startsWith: true });
		}).then((cs) => {
			//1. Copy customers from pouch to sql    	
			_.each(cs, function(customer) {
				let cus = {
					id: customer.id,
					mobile: customer.mobile,
					name: customer.name,
					email: customer.email,
					autocomplete: customer.autocomplete,
					street_num: customer.street_num,
					street_route: customer.street_route,
					apartment: customer.apartment,
					city: customer.city,
					state: customer.state,
					zip: customer.zip,
					lat: customer.lat,
					lng: customer.lng,
					delivery_notes: customer.delivery_notes,
					cleaning_notes: customer.cleaning_notes,
					payment_customer_token: customer.payment_customer_token,
					payment_customer_id: customer.payment_customer_id,
					is_doorman: customer.is_doorman ? 1 : 0
				};


				var query = SQLconnection.query('INSERT INTO etl_customers SET ?', cus, function(error, results, fields) {
					if (error) throw error;
				});
			});
			return customer_cards.find("customer_id", "", { startsWith: true });
		}).then((crds) => {
			//2. Copy customer cards from pouch to sql  
			_.each(crds, function(card) {
				let crd = {
					id: card.id,
					customer_id: card.customer_id,
					card_id: card.card_id,
					brand: card.brand,
					last4: card.last4,
					is_default: card.is_default ? 1 : 0
				}

				var query = SQLconnection.query('INSERT INTO etl_customer_cards SET ?', crd, function(error, results, fields) {
					if (error) throw error;
				});
			});
			return orders.find("customer_id", "", { startsWith: true });
		}).then((ords) => {
			//3. Copy orders from pouch to sql	     
			_.each(ords, function(order) {
				let ord = {
					id: order.id,
					customer_id: order.customer_id,
					readable_id: order.readable_id,
					due_datetime: order.due_datetime ? new Date(order.due_datetime) : null,
					rack: order.rack,
					notes: order.notes,
					tax: order.tax,
					tip: order.tip,
					discount_percent: order.discount_percent,
					discount_fixed: order.discount_fixed,
					balance: order.balance,
					all_ready: order.all_ready ? 1 : 0,
					all_pickedup: order.all_pickedup ? 1 : 0,
					delivery_pickup_id: order.delivery_pickup_id,
					delivery_dropoff_id: order.delivery_dropoff_id
				}

				var query = SQLconnection.query('INSERT INTO etl_orders SET ?', ord, function(error, results, fields) {
					if (error) throw error;
				});
			});
			return order_items.find("order_id", "", { startsWith: true });
		}).then((ord_items) => {
			//4. Copy order items from pouch to sql	
			_.each(ord_items, function(order_item) {
				let ord_item = {
					id: order_item.id,
					order_id: order_item.order_id,
					item_id: order_item.item_id,
					name: order_item.name,
					total_price: order_item.total_price,
					quantity: order_item.quantity,
					notes: order_item.notes,
					separate: order_item.separate ? 1 : 0,
					wash: order_item.wash ? 1 : 0,
					dry: order_item.dry ? 1 : 0,
					detergent: order_item.detergent,
					color: order_item.color,
					pattern: order_item.pattern,
					brand: order_item.brand,
					fabric: order_item.fabric,
					alteration_type: order_item.alteration_type
				}
				var query = SQLconnection.query('INSERT INTO etl_order_items SET ?', ord_item, function(error, results, fields) {
					if (error) throw error;
				});
			});
			return order_tags.find("order_id", "", { startsWith: true });
		}).then((ord_tags) => {
			//5. Copy order tagss from pouch to sql	
			_.each(ord_tags, function(order_tag) {
				let ord_tag = {
					id: order_tag.id,
					order_id: order_tag.order_id,
					tag_number: order_tag.tag_number
				}
				var query = SQLconnection.query('INSERT INTO etl_order_tags SET ?', ord_tag, function(error, results, fields) {
					if (error) throw error;
				});
			});
			return order_charges.find("order_id", "", { startsWith: true });
		}).then((ord_charges) => {
			//6. Copy order charges from pouch to sql	
			_.each(ord_charges, function(order_charge) {
				let ord_charge = {
					id: order_charge.id,
					order_id: order_charge.order_id,
					amount: order_charge.amount,
					charge_type: order_charge.charge_type,
					charge_id: order_charge.charge_id,
					card_id: order_charge.card_id,
					date_cash: order_charge.date_cash ? new Date(order_charge.date_cash) : null,
					refund_id: order_charge.refund_id,
					amount_refunded: order_charge.amount_refunded
				}
				var query = SQLconnection.query('INSERT INTO etl_order_charges SET ?', ord_charge, function(error, results, fields) {
					if (error) throw error;
				});
			});
			return deliveries.find("delivery_time", "", { startsWith: true });
		}).then((delivs) => {
			//7. Copy deliveriesfrom pouch to sql	
			let amount = delivs.length;
			let i = 0;
			_.each(delivs, function(delivery) {
				let deliv = {
					id: delivery.id,
					customer_id: delivery.customer_id,
					is_pickup: delivery.is_pickup ? 1 : 0,
					delivery_time: new Date(delivery.delivery_time),
					delivery_person: delivery.delivery_person,
					is_confirmed: delivery.is_confirmed ? 1 : 0,
					is_canceled: delivery.is_canceled ? 1 : 0,
					express_id: delivery.express_id
				}
				var query = SQLconnection.query('INSERT INTO etl_deliveries SET ?', deliv, function(error, results, fields) {
					if (error) throw error;
					i++;
					if (i == amount) {
						console.log("About to disconnect");
						disconnectSQL();
						if (config.mocks) {
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
function hardcodedMock() {
	return new Promise((res, rej) => {
		let t = this;
		let customerObj = {
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
			readable_id: "abc123",
			due_datetime: new Date().getTime(),
			rack: "222",
			notes: "Please do quickly",
			tax: 1.95,
			tip: 2.00,
			discount_fixed: 5.00,
			balance: 100.00,
			all_ready: true,
			all_pickedup: true,
			delivery_pickup_id: "del_hff_6546",
			delivery_dropoff_id: "del_gee_86"
		};

		let deliveryPickupObj = {
			is_pickup: true,
			delivery_time: new Date().getTime(),
			delivery_person: "Candido Bear",
			is_confirmed: true
		}

		let deliveryDropoffObj = {
			is_pickup: false,
			delivery_time: new Date().getTime(),
			express_id: "del_55h_f"
		}

		let orderItem1Obj = {
			item_id: "1234",
			total_price: 20.52,
			name: "Washfold",
			quantity: 3,
			notes: "Clean hard",
			separate: true,
			wash: true,
			detergent: "Tide"
		};

		let orderItem2Obj = {
			item_id: "2a2a",
			total_price: 10.00,
			name: "Pants",
			quantity: 1,
			dry: true,
			color: "blue"
		};

		let orderItem3Obj = {
			item_id: "2b2b",
			total_price: 5.00,
			name: "Skirts",
			quantity: 2,
			dry: true,
			color: "red",
			brand: "Zara",
			pattern: "zebra",
			alteration_type: "Sew zipper"
		};

		let orderTagObj = {
			tag_number: 222
		};

		let orderChargeObj = {
			amount: 120.25,
			charge_id: "ch_4474_h647",
			charge_type: "card"
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
		}).catch(function(m) {
			console.log(m);
			console.log("Error in testWorkflow");
			return rej(new Error("Error"));
		});
	});
}



function mock() {
	return new Promise((res, rej) => {
		let t = this;

		let customerObj = {
			mobile: (Math.floor(Math.random() * 9000000000) + 1000000000).toString(),
			name: faker.name.findName(),
			email: faker.internet.email(),
			autocomplete: "199 Orchard St, New York, NY 10002, USA",
			street_num: faker.random.number(),
			street_route: faker.address.streetName(),
			apartment: faker.random.number(),
			city: faker.address.city(),
			state: "NY",
			zip: faker.address.zipCode(),
			lat: "40.72224",
			lng: "-73.988152",
			delivery_notes: "Ring bell twice",
			cleaning_notes: "Clean slowly",
			payment_customer_id: "cus_" + faker.random.uuid(),
			payment_customer_token: "tok_" + faker.random.uuid()
		};

		let customerDefaultCardObj = {
			card_id: "card_" + faker.random.uuid(),
			brand: "Visa",
			last4: "4242",
			is_default: true
		};

		let customerSecondCardObj = {
			card_id: "card_" + faker.random.uuid(),
			brand: "Visa",
			last4: "0341",
			is_default: false
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
			item_id: "2b2b",
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
			charge_id: "ch_" + faker.random.uuid(),
			charge_type: "card"
		};

		let orderChargeCashObj = {
			amount: faker.commerce.price(),
			charge_id: "ch_" + faker.random.uuid(),
			charge_type: "cash",
			date_cash: new Date().getTime()
		}

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
			orderChargeCashObj["card_id"] = cust_default_card.id;
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
			orderChargeCashObj["order_id"] = ord.id;
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
			//Insert cash charge
			return order_charges.insert(orderChargeCashObj);   
		}).then((ord_charge2) => { 
			return deliveries.insert(deliveryDropoffObj);
		}).then((delivDropoff) => {
			return res(true);
		}).catch(function(m) {
			console.log(m);
			console.log("Error in mock");
			return rej(new Error("Error"));
		});
	});
}


