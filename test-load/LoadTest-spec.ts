import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as faker from 'faker';
import Promise from "ts-promise";

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




const expect = chai.expect;

@suite("Load test")
class LoadTest {

  static db;
//Static variable definitions
  static customers: Customers;
  static customer_cards: CustomerCards;
  static orders: Orders;
  static deliveries: Deliveries;
  static order_items: OrderItems;
  static order_tags: OrderTags;
  static order_charges: OrderCharges;



//Database before and after
  static before() {
    LoadTest.db = new PouchDB("default");
    LoadTest.customers = new Customers(LoadTest.db, Customer);
    LoadTest.customer_cards = new CustomerCards(LoadTest.db, CustomerCard);
    LoadTest.orders = new Orders(LoadTest.db, Order);
    LoadTest.deliveries = new Deliveries(LoadTest.db, Delivery);
    LoadTest.order_items = new OrderItems(LoadTest.db, OrderItem);
    LoadTest.order_tags = new OrderTags(LoadTest.db, OrderTag);
    LoadTest.order_charges = new OrderCharges(LoadTest.db, OrderCharge);
  }

  static after(done: Function) {
    LoadTest.db.destroy(() => done());
  }

  public hardcodedWorkflow(){
   return new Promise((res, rej) => {
      let customers = LoadTest.customers;
      let customer_cards = LoadTest.customer_cards;
      let orders = LoadTest.orders;
      let deliveries = LoadTest.deliveries;
      let order_items = LoadTest.order_items;
      let order_tags = LoadTest.order_tags;
      let order_charges = LoadTest.order_charges;
      let t = this;
      let test_name = "";

      let customerObj= {
      mobile: (Math.floor(Math.random() * 9000000000) + 1000000000).toString(),
      name: "Joe Shmoe",
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
       expect(cust_default_card.customer_id).to.exist;
       expect(cust_default_card.is_default).to.equal(true);
       orderChargeObj["card_id"] = cust_default_card.id;
//Insert second card       
       return customer_cards.insert(customerSecondCardObj); 
    }).then((cust_second_card) => {
      expect(cust_second_card.customer_id).to.exist;
      expect(cust_second_card.is_default).to.equal(false);
//Insert delivery pickup      
      return deliveries.insert(deliveryPickupObj);
     }).then((delivPickup) => {  
       expect(delivPickup.customer_id).to.exist;
//Insert order
      return orders.insert(orderObj);
    }).then((ord) => {
      expect(ord.customer_id).to.exist;
      orderItem1Obj["order_id"] = ord.id; 
      orderItem2Obj["order_id"] = ord.id; 
      orderItem3Obj["order_id"] = ord.id; 
      orderTagObj["order_id"] = ord.id; 
      orderChargeObj["order_id"] = ord.id;
//Insert order item 1      
      return order_items.insert(orderItem1Obj);
    }).then((ord_item_1) => {
      expect(ord_item_1.order_id).to.exist;
//Insert order item 2
      return order_items.insert(orderItem2Obj);
    }).then((ord_item_2) => {
      expect(ord_item_2.order_id).to.exist;
//Insert order item 3
      return order_items.insert(orderItem3Obj);
    }).then((ord_item_3) => {
//Insert 3 order tags      
      expect(ord_item_3.order_id).to.exist;
      return order_tags.insert(orderTagObj);
    }).then((ord_tag1) => {
      expect(ord_tag1.order_id).to.exist;
      return order_tags.insert(orderTagObj);
    }).then((ord_tag2) => {
      expect(ord_tag2.order_id).to.exist;
      return order_tags.insert(orderTagObj);
    }).then((ord_tag3) => {
      expect(ord_tag3.order_id).to.exist;
//Insert order charge
      return order_charges.insert(orderChargeObj);
    }).then((ord_charge) => {
      expect(ord_charge.order_id).to.exist;
      expect(ord_charge.card_id).to.exist;
//Insert delivery dropoff      
      return deliveries.insert(deliveryDropoffObj);
     }).then((delivDropoff) => {  
       expect(delivDropoff.customer_id).to.exist;  
       return res(true);
    }).catch(function(m){
      console.log(m);
      console.log("Error in testWorkflow");
      return rej(new Error("Error"));
    });
   });
  }

  public testWorkflow(){
     return new Promise((res, rej) => {
      let customers = LoadTest.customers;
      let customer_cards = LoadTest.customer_cards;
      let orders = LoadTest.orders;
      let deliveries = LoadTest.deliveries;
      let order_items = LoadTest.order_items;
      let order_tags = LoadTest.order_tags;
      let order_charges = LoadTest.order_charges;
      let t = this;
      let test_name = "";

      let customerObj= {
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
       expect(cust_default_card.customer_id).to.exist;
       expect(cust_default_card.is_default).to.equal(true);
       orderChargeObj["card_id"] = cust_default_card.id;
//Insert second card       
       return customer_cards.insert(customerSecondCardObj); 
    }).then((cust_second_card) => {
      expect(cust_second_card.customer_id).to.exist;
      expect(cust_second_card.is_default).to.equal(false);
//Insert delivery pickup      
      return deliveries.insert(deliveryPickupObj);
     }).then((delivPickup) => {  
       expect(delivPickup.customer_id).to.exist;
//Insert order
      return orders.insert(orderObj);
    }).then((ord) => {
      expect(ord.customer_id).to.exist;
      orderItem1Obj["order_id"] = ord.id; 
      orderItem2Obj["order_id"] = ord.id; 
      orderItem3Obj["order_id"] = ord.id; 
      orderTagObj["order_id"] = ord.id; 
      orderChargeObj["order_id"] = ord.id;
//Insert order item 1      
      return order_items.insert(orderItem1Obj);
    }).then((ord_item_1) => {
      expect(ord_item_1.order_id).to.exist;
//Insert order item 2
      return order_items.insert(orderItem2Obj);
    }).then((ord_item_2) => {
      expect(ord_item_2.order_id).to.exist;
//Insert order item 3
      return order_items.insert(orderItem3Obj);
    }).then((ord_item_3) => {
//Insert 3 order tags      
      expect(ord_item_3.order_id).to.exist;
      return order_tags.insert(orderTagObj);
    }).then((ord_tag1) => {
      expect(ord_tag1.order_id).to.exist;
      return order_tags.insert(orderTagObj);
    }).then((ord_tag2) => {
      expect(ord_tag2.order_id).to.exist;
      return order_tags.insert(orderTagObj);
    }).then((ord_tag3) => {
      expect(ord_tag3.order_id).to.exist;
//Insert order charge
      return order_charges.insert(orderChargeObj);
    }).then((ord_charge) => {
      expect(ord_charge.order_id).to.exist;
      expect(ord_charge.card_id).to.exist;
//Insert delivery dropoff      
      return deliveries.insert(deliveryDropoffObj);
     }).then((delivDropoff) => {  
       expect(delivDropoff.customer_id).to.exist;  
       return res(true);
    }).catch(function(m){
      console.log(m);
      console.log("Error in testWorkflow");
      return rej(new Error("Error"));
    });
   });
  }


  @test("Time loaded workflows") @timeout(500000000)
  public testLoadedWorkflows(done) {
    let customers = LoadTest.customers;
    let t = this;
    let d0 = new Date().getTime(), d1 = 0, d2 = 0, d3 = 0,d4 = 0,d5 = 0;
//About to test 100
    let ps = [];
    _.times(100, function(){
      ps.push(t.testWorkflow());
    })
    ps.push(t.hardcodedWorkflow());
    Promise.all(ps).then(()=> {
      d1 = new Date().getTime();
      console.log("100 promises done");
      console.log("-----------------");
      console.log("total time inserting workflows: ", d1-d0);
      console.log("average workflow insertion time: ", (d1-d0)/100);
      return customers.find("name", "Joe Shmoe");
    }).then((cs) => {
      console.log("We searched after 100 workflows");
      expect(cs[0].name).to.equal("Joe Shmoe");
//About to test 500
      let ps = [];
      _.times(500, function(){
        ps.push(t.testWorkflow());
      })
      ps.push(t.hardcodedWorkflow());
      Promise.all(ps).then(()=> {
        d2 = new Date().getTime();
        console.log("500 promises done");
        console.log("-----------------");
        console.log("total time inserting workflows: ", d2-d1);
        console.log("average workflow insertion time: ", (d2-d1)/500);
        return customers.find("name", "Joe Shmoe");
      }).then((cs2) => {
        console.log("We searched after 500 workflows");
        expect(cs2[0].name).to.equal("Joe Shmoe");
//About to test 1000
        let ps = [];
        _.times(1000, function(){
          ps.push(t.testWorkflow());
        })
        ps.push(t.hardcodedWorkflow());
        Promise.all(ps).then(()=> {
          d3 = new Date().getTime();
          console.log("1000 promises done");
          console.log("-----------------");
          console.log("total time inserting workflows: ", d3-d2);
          console.log("average workflow insertion time: ", (d3-d2)/1000);
          return customers.find("name", "Joe Shmoe");
        }).then((cs2) => {
          console.log("We searched after 1000 workflows");
          expect(cs2[0].name).to.equal("Joe Shmoe");   
//About to test 5000     
          let ps = [];
          _.times(5000, function(){
            ps.push(t.testWorkflow());
          })
          ps.push(t.hardcodedWorkflow());
          Promise.all(ps).then(()=> {
            d4 = new Date().getTime();
            console.log("5000 promises done");
            console.log("-----------------");
            console.log("total time inserting workflows: ", d4-d3);
            console.log("average workflow insertion time: ", (d4-d3)/5000);
            return customers.find("name", "Joe Shmoe");
          }).then((cs2) => {
            console.log("We searched after 5000 workflows");
            expect(cs2[0].name).to.equal("Joe Shmoe");  
// //About to test 10,000  
            let ps = [];
            _.times(10000, function(){
              ps.push(t.testWorkflow());
            })
            ps.push(t.hardcodedWorkflow());
            Promise.all(ps).then(()=> {
              d5 = new Date().getTime();
              console.log("10000 promises done");
              console.log("-----------------");
              console.log("total time inserting workflows: ", d5-d4);
              console.log("average workflow insertion time: ", (d5-d4)/10000);
              return customers.find("name", "Joe Shmoe");
            }).then((cs2) => {
              console.log("Cs2 lenght")
              console.log(cs2.length);
              expect(cs2[0].name).to.equal("Joe Shmoe");
              let access = new Database("default");
              access.connect("http://35.185.57.20:5984", "aa0c19ba", "aa0c19ba", "aa0c19ba").then((r) => {    
                  return access.remoteStatus();
              }).then((response) => {
                  access.sync().on('complete', () => {
                      access.remoteStatus().then(function (result) {
                          if (result.doc_count == 0) {
                              console.log(result);
                              throw new Error("couldn't sync with database");
                          }
                          done()
                      }).catch(_.noop);
                  }).on(_.noop);
              }).catch(_.noop);
            });
          });
        });
      });
    });
  } 
}


