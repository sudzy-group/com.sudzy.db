import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as faker from 'faker';
import Promise from "ts-promise";

import { Customers } from "../src/collections/Customers";
import {CustomerCards} from "../src/collections/CustomerCards";
import {Orders} from "../src/collections/Orders";
import {OrderItems} from "../src/collections/OrderItems";
import {OrderTags} from "../src/collections/OrderTags";
import {OrderCharges} from "../src/collections/OrderCharges";
import {Deliveries} from "../src/collections/Deliveries";

import {Customer} from "../src/entities/Customer";
import {CustomerCard} from "../src/entities/CustomerCard";
import {Order} from "../src/entities/Order";
import {OrderItem} from "../src/entities/OrderItem";
import {OrderTag} from "../src/entities/OrderTag";
import {OrderCharge} from "../src/entities/OrderCharge";
import {Delivery} from "../src/entities/Delivery";
import { Database } from '../src/access/Database';

import * as express from "express";
import * as expressPouchdb from "express-pouchdb";
import * as converter from "couchdb-to-mysql";

const expect = chai.expect;

@suite("Mysql mocks test")
class MockTest {

  static db;
//Static variable definitions
  static customers: Customers;

//Database before and after
  static before() {
    var app = express();
    app.use('/', expressPouchdb(PouchDB));
    app.listen(5555);
    MockTest.db = new PouchDB("http://localhost:5555/mocks");
    MockTest.customers = new Customers(MockTest.db, Customer);
   

    var cvr = converter({
      "couch" : {
          "host" : "127.0.0.1",
          "port" : "5555",
          "database" : "mocks"
      },

      "mySQL" : {
          "host" : "127.0.0.1",
          "port" : "3306",
          "user" : "root",
          "password" : "",
          "database" : "Pouch"
      },

      "queries" : {
          "insert" : "insert into post set ?",
          "update" : "",
          "delete" : "delete from post where id = ?"
      }
    }
  );
    MockTest.db.info().then(function (info) {
      console.log(info);
      cvr.connect();
      

      cvr.on('created', function (change) {
        console.log("created");
        console.log(change);
        var self = this;
        var query = this.config.queries.insert;
        console.log("QUERY");
        console.log(query);
        // this.database.get(change.id, function (err, res) {
          // if (err) throw err;
          // var doc = { id : res._id, title : res.title };
          // self.mysql.query(query, doc, function (err) {
          //     // prevents dups error.
          // });
      // });
        // replicate changes on mysql 
       });

      cvr.on('deleted', function (change) {
        console.log("deleted");
        console.log(change);
      });

      cvr.on('updated', function (change) {
        console.log("updated");
        console.log(change);
      })    

   })
  
   
  }

  static after(done: Function) {
    MockTest.db.destroy(() => done());
  }

 

 public hardcodedMock(){
   return new Promise((res, rej) => {
      let customers = MockTest.customers;
      let t = this;

      let customerObj= {
        mobile: "19173411892",
        name: "Joe Shmoe",
        email: faker.internet.email(),
        autocomplete: "199 Orchard St, New York, NY 10002, USA",
        street_num: "199",
        street_route: "Orchard Street",
        apartment: "2D",
        city: "New York",
        state: "NY",
        zip: "10002",
        lat: "40.72224",
        lng: "-73.988152",
        delivery_notes: "Ring bell twice",
        cleaning_notes: "Clean slowly",
        payment_customer_id: "cus_difif_29392",
        payment_customer_token: "tok_f9f9f_dodod"
      };

 
    //Insert customer
    customers.insert(customerObj).then((cust) => {
       return res(true);
    }).catch(function(m){
      console.log(m);
      console.log("Error in mock");
      return rej(new Error("Error"));
    });
   });
  }

 

  @test("Test mocks") @timeout(900000000)
  public testMocks(done) {
    let customers = MockTest.customers;
    let t = this;
//About to insert 10 mocks
    let ps = [];
    ps.push(t.hardcodedMock());
    Promise.all(ps).then(()=> {
      return customers.find("name", "Joe Shmoe");
    }).then((cs) => {
      console.log("We searched after mocks inserted");
      expect(cs[0].name).to.equal("Joe Shmoe");
      done();
     }).catch(_.noop);
  } 
}

