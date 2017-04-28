import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Customer } from "../src/entities/Customer";
import { Customers } from "../src/collections/Customers";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as metaphone from 'metaphone';

const expect = chai.expect;

@suite("MultipleConnections test")
class MultipleConnectionsTest {

  @test("should return correct prefix")
  public testMultiple(done) {
    let db = new PouchDB("default");
    let customerObj = {
      formatted_mobile: "+1(929)2778391",
      mobile: "19292778391",
      allow_notifications: true,
      name: "Roy Ganor",
    }
    const customers = new Customers(db, Customer);
    customers.insert(customerObj).then((c) => {
      return customers.find('mobile','19292778391');
    }).then(cs => {
      let c = cs[0];
      let updatedCustomerObj = {
        name: "Roy Ganor1",
      }
      return customers.update(c, updatedCustomerObj);
    }).then((cus) => {
      let db1 = new PouchDB("default");
      const customers = new Customers(db1, Customer);
      return customers.find('mobile','19292778391');
    }).then((cs) => {
      let c = cs[0];
      let updatedCustomerObj = {
        name: "Roy Ganor1",
      }
      return customers.update(c, updatedCustomerObj);
    }).then((c) => {
      let db1 = new PouchDB("default");
      db1.destroy(() => done());
    }).catch((m) => {
      console.log(m);
    });
  }
}

