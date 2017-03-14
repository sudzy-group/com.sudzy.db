import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Customer } from "../src/entities/Customer";
import { Customers } from "../src/collections/Customers";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as metaphone from 'metaphone';

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
    customers.insert({ mobile: "6465490561" }).then((c) => {
      expect(c.mobile).to.equal("6465490561");
      done();
    }).catch(_.noop);
  }

  @test("should be searchable by last4")
  public testLast4(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6465490562" }).then((c) => {
      return customers.find("mobile", "0562")
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].mobile).to.equal("6465490562");
      done();
    }).catch(_.noop);
  }

  @test("should find by metaphone")
  public testMetaphone(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ name: "Roy Ganor", mobile: "6465490563" }).then((c) => {
      return customers.findByName("Roi Gnor");
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].name).to.equal("Roy Ganor");
      done();
    }).catch(_.noop);
  }  

}

