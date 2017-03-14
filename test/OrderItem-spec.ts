import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { OrderItem } from "../src/entities/OrderItem";
import { OrderItems } from "../src/collections/OrderItems";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Order item test")
class OrderItemTest {

  static db;

  static before() {
    OrderItemTest.db = new PouchDB("default");
  }

  static after(done: Function) {
    OrderItemTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const order_items = new OrderItems(OrderItemTest.db, OrderItem);
    expect(order_items.getPrefix()).to.equal("order-item");
  }
}

