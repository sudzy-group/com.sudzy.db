import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

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

@suite("Workflow test")
class WorkflowTest {

  static db;
//Static variable definitions
  static customers: Customers;
  static customer_cards: CustomerCards;
  static orders: Orders;
  static deliveries: Deliveries;

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
     order_id: "e5d4707d-cd54-bed3-7570-6e9dbec307zz",
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


//Database before and after
  static before() {
    WorkflowTest.db = new PouchDB("default");
    WorkflowTest.customers = new Customers(WorkflowTest.db, Customer);
    WorkflowTest.customer_cards = new CustomerCards(WorkflowTest.db, CustomerCard);
    WorkflowTest.orders = new Orders(WorkflowTest.db, Order);
    WorkflowTest.deliveries = new Deliveries(WorkflowTest.db, Delivery);
  }

  static after(done: Function) {
    WorkflowTest.db.destroy(() => done());
  }

  @test("should create customer, customercards, order")
  public testCreateCustomerAndCustomerCard(done) {
    let customers = WorkflowTest.customers;
    let customer_cards = WorkflowTest.customer_cards;
    let orders = WorkflowTest.orders;
    let deliveries = WorkflowTest.deliveries;
    let t = this;

//Insert customer
    customers.insert(this.customerObj).then((cust) => {
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
    //   return
    // }).then((order_item) => {
      
      done();
    }).catch(_.noop);
  } 
}



