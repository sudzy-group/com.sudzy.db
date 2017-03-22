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

@suite("Mysql mocks test")
class MockTest {

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
      mobile: "19292778399",
      name: "Joseph Shmoo",
      email: "joesh@gmail.com",
      autocomplete: "199 Orchard St, New York, NY 10002, USA",
      street_num: "199",
      street_route: "Orchard Street",
      apartment: "2D",
      city: "New York",
      state: "NY",
      zip: "10002",
      lat: "40.72224",
      lng: "-73.988152",
      is_doorman: true,
      delivery_notes: "Ring bell twice",
      cleaning_notes: "Clean slowly",
      payment_customer_id: "cus_9xJOnv9Enc98S",
      payment_customer_token: "tok_19dOlrDMuhhpO1mOm4flWqa"
   };

   private customerDefaultCardObj: any = {
     card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
     brand: "Visa",
     last4: "4242",
     is_default: true
   };

   private customerSecondCardObj: any = {
     card_id: "card_19lh5ADMuhhpO1mOISZJFYt0",
     brand: "Visa",
     last4: "0341",
     is_default: false
   };

   private orderObj: any = {
     readable_id: "e5d4707d-cd54-bed3-7570-6e9dbec307zz",
     due_datetime: new Date().getTime(),
     rack: "222",
     notes: "Please do quickly",
     tax: 1.00,
     tip: 3.00,
     discount_fixed: 5.00,
     balance: 100.00,
     all_ready: true,
     all_pickedup: true,
     delivery_pickup_id: "del_0BRnIfvg8xbH8k",
     delivery_dropoff_id: "del_0BRnIfvg8xbH8z"
   };

   private deliveryPickupObj: any = {
     is_pickup: true,
     delivery_time: new Date().getTime(),
     delivery_person: "Jason",
     is_confirmed: true
   }

   private deliveryDropoffObj: any = {
     is_pickup: false,
     delivery_time: new Date().getTime(),
     express_id: "del_g2RnIfvg8xbH8k"
   }

   private orderItem1Obj: any = {
     item_id: "1234",
     total_price: 10.00,
     name: "Washfold",
     quantity: 1,
     notes: "Clean hard",
     separate: true,
     wash: true,
     detergent: "Tide"
   };

   private orderItem2Obj: any = {
     item_id: "2a2a",
     total_price: 15.40,
     name: "Pants",
     quantity: 3,
     dry: true,
     color: "black"
   };

   private orderItem3Obj: any = {
     item_id: "2a2a",
     total_price: 4.20,
     name: "Skirts",
     quantity: 1,
     dry: true,
     color: "red",
     brand: "Zara",
     pattern: "zebra",
     alteration_type: "Sew zipper"
   };

   private orderTagObj: any = {
     tag_number: 333
   };

   private orderChargeObj: any = {
     amount: 100.00,
     charge_id: "ch_19p52VDMuhhpO1mOP08I3P3B"
   };


//Database before and after
  static before() {
    MockTest.db = new PouchDB("default");
    MockTest.customers = new Customers(MockTest.db, Customer);
    MockTest.customer_cards = new CustomerCards(MockTest.db, CustomerCard);
    MockTest.orders = new Orders(MockTest.db, Order);
    MockTest.deliveries = new Deliveries(MockTest.db, Delivery);
    MockTest.order_items = new OrderItems(MockTest.db, OrderItem);
    MockTest.order_tags = new OrderTags(MockTest.db, OrderTag);
    MockTest.order_charges = new OrderCharges(MockTest.db, OrderCharge);
  }

  static after(done: Function) {
    MockTest.db.destroy(() => done());
  }

 

 public hardcodedMock(){
   return new Promise((res, rej) => {
      let customers = MockTest.customers;
      let customer_cards = MockTest.customer_cards;
      let orders = MockTest.orders;
      let deliveries = MockTest.deliveries;
      let order_items = MockTest.order_items;
      let order_tags = MockTest.order_tags;
      let order_charges = MockTest.order_charges;
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
      console.log("Error in mock");
      return rej(new Error("Error"));
    });
   });
  }

  public mock(){
     return new Promise((res, rej) => {
      let customers = MockTest.customers;
      let customer_cards = MockTest.customer_cards;
      let orders = MockTest.orders;
      let deliveries = MockTest.deliveries;
      let order_items = MockTest.order_items;
      let order_tags = MockTest.order_tags;
      let order_charges = MockTest.order_charges;
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
      console.log("Error in mock");
      return rej(new Error("Error"));
    });
   });
  }


  @test("Test mocks") @timeout(900000)
  public testMocks(done) {
    let customers = MockTest.customers;
    let t = this;
//About to insert 10 mocks
    let ps = [];
    _.times(4, function(){
      ps.push(t.mock());
    })
    ps.push(t.hardcodedMock());
    Promise.all(ps).then(()=> {
      return customers.find("name", "Joe Shmoe");
    }).then((cs) => {
      console.log("We searched after 5 mocks inserted");
      expect(cs[0].name).to.equal("Joe Shmoe");
      done();
     }).catch(_.noop);
   
  } 
}

