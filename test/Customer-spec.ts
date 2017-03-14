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

  @test("should be able to insert customer")
  public testInsert(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6465490561" }).then((c) => {
      expect(c.mobile).to.equal("6465490561");
      done();
    }).catch(_.noop);
  }

  @test("should be searchable by mobile")
  public testFindMobile(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({mobile: "6465490562"}).then((c) => {
      return customers.find("mobile", "6465490562")
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].mobile).to.equal("6465490562");
      done();
    }).catch(_.noop);
  }

  @test("should be searchable by last4")
  public testLast4(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({mobile: "6465490563"}).then((c) => {
      return customers.find("mobile", "0563")
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].mobile).to.equal("6465490563");
      done();
    }).catch(_.noop);
  }

  @test("should be searchable by metaphone")
  public testMetaphone(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ name: "Roy Ganor", mobile: "6465490564" }).then((c) => {
      return customers.findByName("Roi Gnor");
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].name).to.equal("Roy Ganor");
      done();
    }).catch(_.noop);
  }  

  @test("should allow valid email")
  public testValidEmail(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({mobile: "6465490565", email: "jshmo@gmail.com" }).then((c) => {
     expect(c.email).to.equal("jshmo@gmail.com");
      done();
    }).catch(_.noop);
  }  

  @test("should not allow invalid email") 
  public testInvalidEmail(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6465490566", email: "jshmo" }).then(_.noop
    ).catch((c) => {
      done();
    });
  }  

}

