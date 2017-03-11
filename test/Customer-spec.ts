import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Customer } from "../src/entities/Customer";
import { Customers } from "../src/collections/Customers";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Customer test")
class CustomerTest {

  static db;

  static before() {
      CustomerTest.db = new PouchDB("default");
  }
    
  static after(done: Function) {
      CustomerTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const customers = new Customers(CustomerTest.db, Customer);
    expect(customers.getPrefix()).to.equal("customer");
  }

  @test("should phave correct prefix")
  public testInsert(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile : "6465490561" }).then((c) => {
      expect(c.mobile).to.equal("6465490561");
      done();
    }).catch(_.noop);
  }
}
