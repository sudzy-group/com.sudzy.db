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

//Object definitions
  private customerObj: any = {
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

   private customerDefaultCardObj: any = {
     card_id: "card_" + faker.random.uuid(),
     brand: "Visa",
     last4: "4242",
     is_default: true
   };

   private customerSecondCardObj: any = {
     card_id: "card_" + faker.random.uuid(),
     brand: "Visa",
     last4: "0341",
     is_default: false
   };

   private orderObj: any = {
     order_id: faker.random.uuid(),
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

   private deliveryPickupObj: any = {
     is_pickup: true,
     delivery_time: new Date().getTime(),
     delivery_person: faker.name.findName(),
     is_confirmed: true
   }

   private deliveryDropoffObj: any = {
     is_pickup: false,
     delivery_time: new Date().getTime(),
     express_id: "del_" + faker.random.uuid()
   }

   private orderItem1Obj: any = {
     item_id: "1234",
     total_price: faker.commerce.price(),
     name: "Washfold",
     quantity: faker.random.number(),
     notes: "Clean hard",
     separate: true,
     wash: true,
     detergent: "Tide"
   };

   private orderItem2Obj: any = {
     item_id: "2a2a",
     total_price: faker.commerce.price(),
     name: "Pants",
     quantity: faker.random.number(),
     dry: true,
     color: faker.commerce.color()
   };

   private orderItem3Obj: any = {
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

   private orderTagObj: any = {
     tag_number: faker.random.number()
   };

   private orderChargeObj: any = {
     amount: faker.commerce.price(),
     charge_id: "ch_" + faker.random.uuid()
   };


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
      t.customerObj["mobile"] = faker.phone.phoneNumberFormat();
    //Insert customer
    customers.insert(t.customerObj).then((cust) => {
      t.customerDefaultCardObj["customer_id"] = cust.id; 
      t.customerSecondCardObj["customer_id"] = cust.id; 
      t.orderObj["customer_id"] = cust.id; 
      t.deliveryPickupObj["customer_id"] = cust.id; 
      t.deliveryDropoffObj["customer_id"] = cust.id; 
//Insert default card      
      return customer_cards.insert(t.customerDefaultCardObj); 
    }).then((cust_default_card) => {
       expect(cust_default_card.customer_id).to.exist;
       expect(cust_default_card.is_default).to.equal(true);
       t.orderChargeObj["card_id"] = cust_default_card.id;
//Insert second card       
       return customer_cards.insert(t.customerSecondCardObj); 
    }).then((cust_second_card) => {
      expect(cust_second_card.customer_id).to.exist;
      expect(cust_second_card.is_default).to.equal(false);
//Insert delivery pickup      
      return deliveries.insert(t.deliveryPickupObj);
     }).then((delivPickup) => {  
       expect(delivPickup.customer_id).to.exist;
//Insert order
      return orders.insert(t.orderObj);
    }).then((ord) => {
      expect(ord.customer_id).to.exist;
      t.orderItem1Obj["order_id"] = ord.id; 
      t.orderItem2Obj["order_id"] = ord.id; 
      t.orderItem3Obj["order_id"] = ord.id; 
      t.orderTagObj["order_id"] = ord.id; 
      t.orderChargeObj["order_id"] = ord.id;
//Insert order item 1      
      return order_items.insert(t.orderItem1Obj);
    }).then((ord_item_1) => {
      expect(ord_item_1.order_id).to.exist;
//Insert order item 2
      return order_items.insert(t.orderItem2Obj);
    }).then((ord_item_2) => {
      expect(ord_item_2.order_id).to.exist;
//Insert order item 3
      return order_items.insert(t.orderItem3Obj);
    }).then((ord_item_3) => {
//Insert 3 order tags      
      expect(ord_item_3.order_id).to.exist;
      return order_tags.insert(t.orderTagObj);
    }).then((ord_tag1) => {
      expect(ord_tag1.order_id).to.exist;
      return order_tags.insert(t.orderTagObj);
    }).then((ord_tag2) => {
      expect(ord_tag2.order_id).to.exist;
      return order_tags.insert(t.orderTagObj);
    }).then((ord_tag3) => {
      expect(ord_tag3.order_id).to.exist;
//Insert order charge
      return order_charges.insert(t.orderChargeObj);
    }).then((ord_charge) => {
      expect(ord_charge.order_id).to.exist;
      expect(ord_charge.card_id).to.exist;
//Insert delivery dropoff      
      return deliveries.insert(t.deliveryDropoffObj);
     }).then((delivDropoff) => {  
       expect(delivDropoff.customer_id).to.exist;  
       return res(true);
    }).catch(function(){
      console.log("Error in testWorkflow");
      return rej(new Error("Error"));
    });
   });
  }


  @test("Time loaded workflows") @timeout(500000)
  public testLoadedWorkflows(done) {
    let customers = LoadTest.customers;
    let t = this;
//About to test 100
    let ps = [];
    _.times(100, function(){
      ps.push(t.testWorkflow());
    })
    Promise.all(ps).then(()=> {
      console.log("100 promises done");
      return customers.find("name", "Joe Shmoe");
    }).then((cs) => {
      console.log("We searched after 100 insertions");
      expect(cs[0].name).to.equal("Joe Shmoe");
//About to test 500
      let ps = [];
      _.times(500, function(){
        ps.push(t.testWorkflow());
      })
      Promise.all(ps).then(()=> {
        console.log("500 promises done");
        return customers.find("name", "Joe Shmoe");
      }).then((cs2) => {
        console.log("We searched after 500 insertions");
        expect(cs2[0].name).to.equal("Joe Shmoe");
//About to test 1000
        let ps = [];
        _.times(1000, function(){
          ps.push(t.testWorkflow());
        })
        Promise.all(ps).then(()=> {
          console.log("1000 promises done");
          return customers.find("name", "Joe Shmoe");
        }).then((cs2) => {
          console.log("We searched after 1000 insertions");
          expect(cs2[0].name).to.equal("Joe Shmoe");        
 
          done();
        });
      });
    });
  } 
}


