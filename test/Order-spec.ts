import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Order } from "../src/entities/Order";
import { Orders } from "../src/collections/Orders";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Order test")
class OrderTest {

  static db;

  static orders: Orders;

  static before() {
    OrderTest.db = new PouchDB("default");
    OrderTest.orders = new Orders(OrderTest.db, Order);
  }

  static after(done: Function) {
    OrderTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    let orders = OrderTest.orders;
    expect(orders.getPrefix()).to.equal("order");
  }

  //Insert
  @test("should insert order")
  public testInsertOrder(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "xxx",
     readable_id: "e5d4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.customer_id).to.equal("xxx");
      expect(ord.readable_id).to.equal("e5d4707d-cd54-bed3-7570-6e9dbec307zz");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should insert order with notes")
  public testInsertOrderNotes(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "aaa",
     readable_id: "a5d4707d-cd54-bed3-7570-6e9dbec307zz",
     notes: "Pick up quickly"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.notes).to.equal("Pick up quickly");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should insert order with payment info")
  public testInsertOrderPayment(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "aaa",
     readable_id: "a5d4707d-cd54-bed3-7570-6e9dbec307zz",
     due_datetime: new Date().getTime(),
     rack: "222",
     tax: 1.00,
     tip: 3.00,
     discount_fixed: 5.00,
     discount_id: 4
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.tax).to.equal(1.00);
      expect(ord.tip).to.equal(3.00);
      expect(ord.discount_fixed).to.equal(5.00);
      expect(ord.discount_id).to.equal(4);
      done();
    }).catch(m=>console.log(m));
  }

  @test("should insert order")
  public testInsertOrderWithOriginal(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "xxx",
     readable_id: "123dsasa",
     original_id: "abcd-4re"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.original_id).to.equal("abcd-4re");
      done();
    }).catch(m=>console.log(m));
  }  
 
  //Search
  @test("should search customer id")
  public testSearchCustId(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "bbb",
     readable_id: "b5d4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.customer_id).to.equal("bbb");
      return orders.find("customer_id", ord.customer_id);
   }).then((ords) => {   
     expect(ords.length).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }

  @test("should search readable_id")
  public testSearchReadableId(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "bbb",
     readable_id: "c5d4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.readable_id).to.equal("c5d4707d-cd54-bed3-7570-6e9dbec307zz");
      return orders.find("readable_id", ord.readable_id);
   }).then((ords) => {   
     expect(ords.length).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }

  @test("should search balance")
  public testSearchBalance(done) {
    let orders = OrderTest.orders;
    let orderObj1 = {
     customer_id: "ccc",
     readable_id: "e5d4707d-cd54-bed3-7570-6e9dbec307zz",
     balance: 0.00
   }
   orders.insert(orderObj1).then((ord1) => {
      expect(ord1.balance).to.equal(0.00);
      let orderObj2 = {
       customer_id: "ddd",
       readable_id: "f5d4707d-cd54-bed3-7570-6e9dbec307zz",
       balance: 50.00
      }
      return orders.insert(orderObj2);
   }).then((ord2) => {   
     expect(ord2.balance).to.equal(50.00);
     let orderObj3 = {
       customer_id: "eee",
       readable_id: "g5d4707d-cd54-bed3-7570-6e9dbec307zz",
       balance: 45.55
      }
     return orders.insert(orderObj3);
   }).then((ord3) => {  
      expect(ord3.balance).to.equal(45.55);
      return orders.find("balance", "", {startsWith: true});
   }).then((ordersBalance) => {
      expect(ordersBalance.length).to.equal(2);
      return orders.getUnsubmittedPayments()
   }).then((summary : any) => {
      expect(summary.sum).to.equal(95.55);
      expect(summary.ids.length).to.equal(2);
      return orders.find("balance", "", {startsWith: true, descending: true});
    }).then((all) => {
       expect(all[0].balance).to.equal(50.00);
       done();
    }).catch(m=>console.log(m));
  }


  @test("should search due")
  public testSearchDueDate(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "bbb",
     readable_id: "c5d4707d-cd54-bed3-7570-6e9dbec307zz",
     due_datetime: '180304',
     checkpoint: 'ready'
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.due_datetime).to.equal("180304");
      expect(ord.checkpoint).to.equal("ready");
      return orders.find("due_datetime", ord.due_datetime);
   }).then((ords) => {   
     expect(ords.length).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }  

  //Update
  @test("should not update customer_id")
  public testUpdateCustomerId(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "ddd",
     readable_id: "f5d4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.customer_id).to.equal("ddd");
      let orderUpdated = {
         customer_id: "d2d",
      }
      return orders.update(ord, orderUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not update readable_id")
  public testUpdateReadableId(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "eee",
     readable_id: "ggd4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.readable_id).to.equal("ggd4707d-cd54-bed3-7570-6e9dbec307zz");
      let orderUpdated = {
         readable_id: "g2d4707d-cd54-bed3-7570-6e9dbec307zz"
      }
      return orders.update(ord, orderUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should update all_ready")
  public testUpdateAllReady(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "eee",
     readable_id: "aaad4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.readable_id).to.equal("aaad4707d-cd54-bed3-7570-6e9dbec307zz");
      let orderUpdated = {
         all_ready: true
      }
      return orders.update(ord, orderUpdated);
     }).then((ordUpdated) => {   
       expect(ordUpdated.all_ready).to.equal(true);
       done();
    }).catch(m=>console.log(m));
  }  

  @test("should update all_pickedup")
  public testUpdateAllPickedup(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "g2g",
     readable_id: "hhd4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.readable_id).to.equal("hhd4707d-cd54-bed3-7570-6e9dbec307zz");
      let orderUpdated = {
         all_pickedup: true
      }
      return orders.update(ord, orderUpdated);
     }).then((ordUpdated) => {   
       expect(ordUpdated.all_pickedup).to.equal(true);
       done();
    }).catch(m=>console.log(m));
  }  

  @test("should update delivery ids")
  public testUpdateDeliveryIds(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "h2h",
     readable_id: "iid4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      let orderUpdated = {
         delivery_pickup_id: "abc",
         delivery_dropoff_id: "efg"
      }
      return orders.update(ord, orderUpdated);
     }).then((ordUpdated) => {   
       expect(ordUpdated.delivery_pickup_id).to.equal("abc");
       expect(ordUpdated.delivery_dropoff_id).to.equal("efg");
       done();
    }).catch(m=>console.log(m));
  }  

  @test("should update note")
  public testUpdateNote(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "i2i",
     readable_id: "jjd4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj, new Date().getTime() - 200).then((ord) => {
      let orderUpdated = {
         notes: "Perdy outfit"
      }
      return orders.update(ord, orderUpdated);
     }).then((ordUpdated) => {   
       expect(ordUpdated.notes).to.equal("Perdy outfit");
       done();
    }).catch(m=>console.log(m));
  }  

  @test("should update payment info")
  public testUpdatePayment(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "k2k",
     readable_id: "lld4707d-cd54-bed3-7570-6e9dbec307zz"
   }
   orders.insert(orderObj).then((ord) => {
      let orderUpdated = {
         tax: 1.00,
         tip: 3.00,
         balance: 250.40
      }
      return orders.update(ord, orderUpdated);
     }).then((ordUpdated) => {   
       expect(ordUpdated.tax).to.equal(1.00);
       expect(ordUpdated.tip).to.equal(3.00);
       expect(ordUpdated.balance).to.equal(250.40);
       done();
    }).catch(m=>console.log(m));
  } 


  //Delete
  @test("should delete order")
  public testDeleteOrder(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "a3a",
     readable_id: "1114707d-cd54-bed3-7570-6e9dbec307zz"
   }
   let id = "";
   orders.insert(orderObj).then((ord) => {
      id = ord.id;
      return orders.remove(ord);
   }).then((e) => {
      return orders.get(id);
   }).then(_.noop)
   .catch((c) => {
       done();
   });
  }


  //Validators
  @test("balance shouldn't be negative")
  public testBalance0(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "ddd",
     readable_id: "f5d4707d-cd54-bed3-7570-6e9dbec307zz",
     balance: -2.00
   }
   orders.insert(orderObj).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("delivery id shouldn't have whitespace")
  public testDelividWhitespace(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     customer_id: "ddd",
     readable_id: "f5d4707d-cd54-bed3-7570-6e9dbec307zz",
     delivery_pickup_id: "del_ 112"
   }
   orders.insert(orderObj).then(_.noop)
      .catch((c) => {
        done();
    });
  }

}

