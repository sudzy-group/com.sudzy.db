import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { OrderItem } from "../src/entities/OrderItem";
import { OrderItems } from "../src/collections/OrderItems";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Order item test")
class OrderItemTest {

  static db;
  static order_items: OrderItems;

  static before() {
    OrderItemTest.db = new PouchDB("default");
    OrderItemTest.order_items = new OrderItems(OrderItemTest.db, OrderItem);
  }

  static after(done: Function) {
    OrderItemTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
     let order_items = OrderItemTest.order_items;
    expect(order_items.getPrefix()).to.equal("order-item");
  }


//Insert
 @test("should insert order item")
  public testInsertOrderItem(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "111",
     isbn: "1234",
     type: 'wf',
     name: "Washfold",     
     price: 10.00,
     quantity: 1,
     manual_name: "ouch",
     notes: ['separate'],
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.order_id).to.equal("111");
      expect(item.isbn).to.equal("1234");
      expect(item.price).to.equal(10.00);
      expect(item.quantity).to.equal(1);
      expect(item.manual_name).to.equal("ouch");
      expect(item.notes.length).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }

  @test("should insert 3 order items")
  public testInsert3OrderItem(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem1Obj = {
     order_id: "222",
     isbn: "1234",
     type: 'wf',
     name: "Washfold",
     ready: true,
     price: 10.00,
     is_manual_pricing: true,
     quantity: 1
   };

   order_items.insert(orderItem1Obj).then((item1) => {
      expect(item1.order_id).to.equal("222");
     let orderItem2Obj = {
     order_id: "222" ,
     type: 'wf',
     isbn: "2a2a",
     price: 15.40,
     pickedup: true,
     name: "Pants",
     quantity: 3
   };
   return order_items.insert(orderItem2Obj);
   }).then((item2) => {
      expect(item2.order_id).to.equal("222");
     let orderItem3Obj = {
     order_id: "222" ,
     type: 'wf',
     isbn: "2a2a",
     price: 4.20,
     name: "Skirts",
     quantity: 1
   };
   return order_items.insert(orderItem3Obj);
  }).then((item3) => {
     expect(item3.order_id).to.equal("222");
     return order_items.find("order_id", "222");
  }).then((items) => {
      expect(items.length).to.equal(3);
      expect(items[0].type).to.equal('wf');
      expect(items[0].manual_name).is.null;
      done();
    }).catch(m=>console.log(m));
  }

//Search
 @test("should search by order id")
  public testSearchOrderId(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "333" ,
     isbn: "324",
     type: "wf",
     price: 10.00,
     name: "Washfold",
     quantity: 1
   };

   order_items.insert(orderItem).then((item) => {
      expect(item.order_id).to.equal("333");
      return order_items.find("order_id", "333");
  }).then((items) => {
      expect(items.length).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }

//Update
@test("should not update order_id")
  public testUpdateOrderId(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "3a3",
     type: "wf",
     isbn: "1234",
     price: 10.00,
     name: "Washfold",
     quantity: 1
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.order_id).to.equal("3a3");
      let orderItemUpdated = {
         order_id: "4a4",
      }
      return order_items.update(item, orderItemUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not update isbn")
  public testUpdateItemId(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "55a",
     isbn: "1234",
     price: 10.00,
     name: "Washfold",
     quantity: 1
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.isbn).to.equal("1234");
      let orderItemUpdated = {
         isbn: "2234",
      }
      return order_items.update(item, orderItemUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not update name")
  public testUpdateName(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "675",
     isbn: "343",
     price: 10.00,
     name: "Washfold",
     quantity: 1
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.isbn).to.equal("343");
      let orderItemUpdated = {
         name: "Shirt"
      }
      return order_items.update(item, orderItemUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should update quantity and price")
  public testUpdateQuantityPrice(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "897",
     isbn: "343",
     type: 'wf',
     price: 10.00,
     name: "Washfold",
     quantity: 5
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.quantity).to.equal(5);
      expect(item.price).to.equal(10.00);
      let orderItemUpdated = {
         price: 20.00,
         quantity: 10
      }
      return order_items.update(item, orderItemUpdated);
       }).then((updatedItem) => {
        expect(updatedItem.price).to.equal(20.00);
        expect(updatedItem.quantity).to.equal(10);
      done();
    }).catch(m=>console.log(m));
  }

//Delete
  @test("should delete order item")
  public testDeleteOrderItem(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "444" ,
     isbn: "324",
     type: 'wf',
     price: 10.00,
     name: "Washfold",
     quantity: 1
   };
   let id = "";

   order_items.insert(orderItem).then((item) => {
      expect(item.order_id).to.equal("444");
      id = item.id;
      return order_items.remove(item);
   }).then((e) => {
      return order_items.get(id);
   }).then(_.noop)
   .catch((c) => {
       done();
   });
  }

//Validators
@test("shouldn't allow negative quantity")
  public testNegativeQuantity(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "555" ,
     isbn: "324",
     type: 'wf',
     price: 10.00,
     name: "Washfold",
     quantity: -1
   };
   order_items.insert(orderItem).then(_.noop)
   .catch((c) => {
       done();
   });
  }

  @test("should allow 0 quantity")
  public testZeroQuantity(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "444" ,
     type: 'dc',
     isbn: "324",
     price: 10.00,
     name: "Washfold",
     quantity: 0
   };
   order_items.insert(orderItem).then((item) => {
      expect(item.quantity).to.equal(0);
      done();
    }).catch(m=>console.log(m));
  }

  @test("should allow extra item details")
  public testExtra(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = { order_id: "444", type: "dc", isbn: "324", price: 10.0, name: "Washfold", quantity: 2, extra: [{ quantity: 1, name: "red", price: 0 }, { quantity: 1, name: "blue", price: 1 }] };
    order_items
      .insert(orderItem)
      .then(item => {
        return order_items.get(item.id);
      })
      .then(item => {
        expect(item.extra.length).to.equal(2);
        return order_items.update(item, {extra : null});
      })
      .then(item => {
        return order_items.get(item.id);
      })
      .then(item => {
        expect(item.extra).to.equal(null);
        done();
      })
      .catch(m => console.log(m));
  }

  @test("should allow positive quantity")
  public testPositiveQuantity(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "444" ,
     isbn: "324",
     type: 'wf',
     price: 10.00,
     name: "Washfold",
     quantity: 10
   };
   order_items.insert(orderItem).then((item) => {
      expect(item.quantity).to.equal(10);
      done();
    }).catch(m=>console.log(m));
  }
}

