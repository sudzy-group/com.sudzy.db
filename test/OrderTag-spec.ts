import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { OrderTag } from "../src/entities/OrderTag";
import { OrderTags } from "../src/collections/OrderTags";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Order tag test")
class OrderTagTest {

  static db;

  static before() {
    OrderTagTest.db = new PouchDB("default");
  }

  static after(done: Function) {
    OrderTagTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const order_tags = new OrderTags(OrderTagTest.db, OrderTag);
    expect(order_tags.getPrefix()).to.equal("order-tag");
  }
}

