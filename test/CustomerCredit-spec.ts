import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Customers } from "../src/collections/Customers";
import { Customer } from "../src/entities/Customer";
import { CustomerCredits } from "../src/collections/CustomerCredits";
import { CustomerCredit } from "../src/entities/CustomerCredit";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Customer credit test")
class CustomerCreditTest {

  static db;
  static customers: Customers;
  static customer_credits: CustomerCredits;

  static before() {
    CustomerCreditTest.db = new PouchDB("default");
    CustomerCreditTest.customers = new Customers(CustomerCreditTest.db, Customer);
    CustomerCreditTest.customer_credits = new CustomerCredits(CustomerCreditTest.db, CustomerCredit);
  }

  static after(done: Function) {
    CustomerCreditTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    let customer_credits = CustomerCreditTest.customer_credits;
    expect(customer_credits.getPrefix()).to.equal("credit");
  }

//Insert
  @test("should insert credit")
  public testInsertCredit(done) {
    let customers = CustomerCreditTest.customers;
    let customer_credits = CustomerCreditTest.customer_credits;
    customers.insert({ mobile: "6465490560" }).then((cust) => {
      let creditObj = {
        customer_id: cust.id,
        original: 50,
        employee_id: "1",
        reason: 1,
        description: "Dispute",
        payment_method: "Visa #3456",
        payment_id: "dsjhfjkah_fdskjfa324"
      }
      return customer_credits.insert(creditObj);
    }).then((credit) => {
        expect(credit.customer_id).to.exist;
        expect(credit.original).to.equal(50);
        done();
    }).catch(m=>console.log(m));
  }


 @test("should insert several credits")
  public testInsertTwoCredit(done) {
    let customers = CustomerCreditTest.customers;
    let customer_credits = CustomerCreditTest.customer_credits;
    let c;
    customers.insert({ mobile: "6465490520" }).then((cust) => {
      c = cust;
      let ps = [];
      _.times(4, i => {
        ps.push(customer_credits.insert({
          customer_id: cust.id,
          original: 50,
          employee_id: "1",
          reason: 2,
          description: "Dispute",
          payment_method: "Visa #3456",
          payment_id: "dsjhfjkah_fdskjfa324"
        }))
      })
    }).then(() => {
      return customer_credits.getCredits(c.id, 2);
    }).then(credits => {
      expect(credits.length).to.equal(2);
      done();
    }).catch(m=>console.log(m));
  }

//Update 
  @test("should be able to update balance")
  public testUpdateBalance(done) {
    let customers = CustomerCreditTest.customers;
    let customer_credits = CustomerCreditTest.customer_credits;
    customers.insert({ mobile: "6465490560" }).then((cust) => {
      let creditObj = {
        customer_id: cust.id,
        original: 50,
        employee_id: "1",
        reason: 3,
        description: "Dispute",
        payment_method: "Visa #3456",
        payment_id: ""
      }
      return customer_credits.insert(creditObj);
    }).then((credit) => {
      let updatedCreditObj = {
         balance: 5
      }
      return customer_credits.update(credit, updatedCreditObj);
    }).then((updated_card) => {
      expect(updated_card.getBalance()).to.equal(5);
      done();
    }).catch(m=>console.log(m));
  }

  @test("should be able to update double balance")
  public testUpdateBalanceDouble(done) {
    let customers = CustomerCreditTest.customers;
    let customer_credits = CustomerCreditTest.customer_credits;
    customers.insert({ mobile: "6465490560" }).then((cust) => {
      let creditObj = {
        customer_id: cust.id,
        original: 50,
        employee_id: "1",
        reason: 3,
        description: "Dispute",
        payment_method: "Visa #3456",
        payment_id: ""
      }
      return customer_credits.insert(creditObj);
    }).then((credit) => {
      expect(credit.getBalance()).to.equal(50);
      let updatedCreditObj = {
         balance: 5
      }
      return customer_credits.update(credit, updatedCreditObj);
    }).then((credit) => {
      expect(credit.getBalance()).to.equal(5);
      let updatedCreditObj = {
         balance: 0
      }
      return customer_credits.update(credit, updatedCreditObj);
    }).then((credit) => {
      expect(credit.getBalance()).to.equal(0);
      done();
    }).catch(m=>console.log(m));
  }

}