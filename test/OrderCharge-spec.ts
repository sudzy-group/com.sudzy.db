import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { OrderCharge } from "../src/entities/OrderCharge";
import { OrderCharges } from "../src/collections/OrderCharges";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Order charge test")
class OrderChargeTest {

  static db;

  static before() {
    OrderChargeTest.db = new PouchDB("default");
  }

  static after(done: Function) {
    OrderChargeTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const order_charges = new OrderCharges(OrderChargeTest.db, OrderCharge);
    expect(order_charges.getPrefix()).to.equal("order-charge");
  }
}

