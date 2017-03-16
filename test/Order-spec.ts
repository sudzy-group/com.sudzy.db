import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Order } from "../src/entities/Order";
import { Orders } from "../src/collections/Orders";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Order test")
class OrderTest {

  static db;

  static orders: Orders;

  static before() {
    OrderTest.db = new PouchDB("default");
    OrderTest.orders = new Orders(OrderTest.db, Order);
  }

  static after(done: Function) {
    OrderTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    let orders = OrderTest.orders;
    expect(orders.getPrefix()).to.equal("order");
  }

  //Insert
  @test("should insert order")
  public testInsertOrder(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "xxx",
     readable_id: "e5d4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.customer_id).to.equal("xxx");
      expect(ord.readable_id).to.equal("e5d4707d-cd54-bed3-7570-6e9dbec307zz");
      done();
    }).catch(_.noop);
  }

  @test("should insert order with notes")
  public testInsertOrderNotes(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "aaa",
     readable_id: "a5d4707d-cd54-bed3-7570-6e9dbec307zz",
     notes: "Pick up quickly"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.notes).to.equal("Pick up quickly");
      done();
    }).catch(_.noop);
  }

  @test("should insert order with payment info")
  public testInsertOrderPayment(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "aaa",
     readable_id: "a5d4707d-cd54-bed3-7570-6e9dbec307zz",
     due_datetime: new Date().getTime(),
     rack: "222",
     tax: 1.00,
     tip: 3.00,
     discount_fixed: 5.00,
     balance: 100.50
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.tax).to.equal(1.00);
      expect(ord.tip).to.equal(3.00);
      expect(ord.discount_fixed).to.equal(5.00);
      expect(ord.balance).to.equal(100.50);
      done();
    }).catch(_.noop);
  }
 
  //Search
   @test("should search customer id")
  public testSearchCustId(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "bbb",
     readable_id: "b5d4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.customer_id).to.equal("bbb");
      return orders.find("customer_id", ord.customer_id);
   }).then((ords) => {   
     expect(ords.length).to.equal(1);
      done();
    }).catch(_.noop);
  }
  //Search readable_id
  //Search by existing balance

  //Update
  //Should not update customer_id
  //Should not update readable_id
  //Should all_ready
  //should all_pickedup
  //Should delivery_pickup_id
  //Should delivery_dropoff_id
  //Should note
  //Should update payment info and balance



  //Delete
  //Delete order

  //Validators
//Balance shouldnt be less than 0
//0 balance ok
//Positive balance ok









}

