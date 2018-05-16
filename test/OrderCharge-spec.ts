import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { OrderCharge } from "../src/entities/OrderCharge";
import { OrderCharges } from "../src/collections/OrderCharges";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import Promise from "ts-promise";

const expect = chai.expect;

@suite("Order charge test")
class OrderChargeTest {

  static db;
  static order_charges: OrderCharges;

  static before() {
    OrderChargeTest.db = new PouchDB("default");
    OrderChargeTest.order_charges = new OrderCharges(OrderChargeTest.db, OrderCharge);
  }

  static after(done: Function) {
    OrderChargeTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    let order_charges = OrderChargeTest.order_charges;
    expect(order_charges.getPrefix()).to.equal("order-charge");
  }


  //Insert

  @test("should insert charge")
  public testInsertCharge(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
      order_id: "1",
      amount: 100.00,
      charge_type: "other"
    };
    order_charges.insert(orderChargeObj).then((charge) => {
      expect(charge.order_id).to.equal("1");
      expect(charge.amount).to.equal(100.00);
      done();
    }).catch(m=>console.log(m));
  }


  @test("should insert charge and sub-charge")
  public testInsertCharges(done) {
    let order_charges = OrderChargeTest.order_charges;
    let ps = [
      order_charges.insert({
        order_id: "1",
        amount: 100.00,
        charge_type: "other"
      })  ,
      order_charges.insert({
        order_id: "2",
        amount: 50.00,
        charge_type: "Paid in #023456",
        parent_id: "123"
      })
    ];
    Promise.all(ps).then((charges) => {
      expect(charges.length).to.equal(2);
      done();
    }).catch(m=>console.log(m));
  }
}



