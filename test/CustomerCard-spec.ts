import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { CustomerCard } from "../src/entities/CustomerCard";
import { CustomerCards } from "../src/collections/CustomerCards";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Customer card test")
class CustomerCardTest {

  static db;

  static before() {
    CustomerCardTest.db = new PouchDB("default");
  }

  static after(done: Function) {
    CustomerCardTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const customer_cards = new CustomerCards(CustomerCardTest.db, CustomerCard);
    expect(customer_cards.getPrefix()).to.equal("customer-card");
  }
}

