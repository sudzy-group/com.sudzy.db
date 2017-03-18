import { suite, test, timeout } from "mocha-typescript";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as faker from 'faker';
import Promise from "ts-promise";

import {Orders} from "../src/collections/Orders";
import {Order} from "../src/entities/Order";
import { Database } from '../src/access/Database';

@suite("Load test")
class BalanceTest {

    static db;
    static orders : Orders;

  static before() {
    BalanceTest.db =  new Database("default");
    BalanceTest.orders = new Orders(BalanceTest.db.db, Order);
  }

  static after(done: Function) {
    BalanceTest.db.db.destroy(() => done());
  }

  private _orderObj : any = {
     readable_id: faker.random.uuid(),
     customer_id: "1234567890",
     due_datetime: new Date().getTime(),
     rack: "222",
     notes: "Please do quickly",
     tax: faker.commerce.price(),
     tip: faker.commerce.price(),
     discount_fixed: 5.00,
     all_ready: true,
     all_pickedup: true,
     delivery_pickup_id: "del_" + faker.random.uuid(),
     delivery_dropoff_id: "del_" + faker.random.uuid() 
   };

  @test("Time loaded balance")  @timeout(30000)
  public testLoadedBalance(done) {
      let ps = [];
      let d1 = 0, d2 = 0;
      _.times(9999, (i) => {
          this._orderObj.balance = (i % 50 == 0) ? Math.random() * 10 : 0;
          ps.push(BalanceTest.orders.insert(this._orderObj))
      })
      Promise.all(ps).then(() => {
          return BalanceTest.orders.getUnsubmittedPayments()
      }).then((summary: any) => {
          if (summary.sum > 0) {
            done()
          }
      }).catch(_.noop)
  }
}
