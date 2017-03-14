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

  static before() {
    OrderTest.db = new PouchDB("default");
  }

  static after(done: Function) {
    OrderTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const orders = new Orders(OrderTest.db, Order);
    expect(orders.getPrefix()).to.equal("order");
  }
}

