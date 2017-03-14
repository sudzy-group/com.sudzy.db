import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Delivery } from "../src/entities/Delivery";
import { Deliveries } from "../src/collections/Deliveries";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Delivery test")
class DeliveryTest {

  static db;

  static before() {
    DeliveryTest.db = new PouchDB("default");
  }

  static after(done: Function) {
    DeliveryTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const deliveries = new Deliveries(DeliveryTest.db, Delivery);
    expect(deliveries.getPrefix()).to.equal("delivery");
  }
}

