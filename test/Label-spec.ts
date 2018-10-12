import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Label } from "../src/entities/Label";
import { Labels } from "../src/collections/Labels";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Label test")
class LabelTest {

  static db;
  static labels: Labels;

  static before() {
    LabelTest.db = new PouchDB("default");
    LabelTest.labels = new Labels(LabelTest.db, Label);
  }

  static after(done: Function) {
    LabelTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    expect(LabelTest.labels.getPrefix()).to.equal("lbl");
  }

  //Insert
  @test("should insert label")
  public testInsertLabel(done) {
    let labels = LabelTest.labels;
    let orderItemObj = {
      label: "73482649786143",
      order_id: "111",
      isbn: "1234",
      type: 'wf',
      name: "Washfold",
      price: 10.00,
      quantity: 1,
      notes: ['separate'],
    };
    labels.insert(orderItemObj).then((item) => {
      expect(item.order_id).to.equal("111");
      expect(item.isbn).to.equal("1234");
      expect(item.price).to.equal(10.00);
      expect(item.quantity).to.equal(1);
      expect(item.name).to.equal("Washfold");
      expect(item.notes.length).to.equal(1);
      done();
    }).catch(m => console.log(m));
  }

  @test("should insert 3 order items")
  public testInsert3Label(done) {
    let labels = LabelTest.labels;
    let orderItem1Obj = {
      label: "9873452984",
      order_id: "222",
      isbn: "1234",
      type: 'wf',
      name: "Washfold",
      price: 10.00,
      is_manual_pricing: true,
      quantity: 1
    };
    labels.insert(orderItem1Obj).then((item1) => {
      expect(item1.order_id).to.equal("222");
      let orderItem2Obj = {
        label: "9873452985",
        order_id: "222",
        type: 'wf',
        isbn: "2a2a",
        price: 15.40,
        name: "Pants",
        quantity: 3
      };
      return labels.insert(orderItem2Obj);
    }).then((item2) => {
      expect(item2.order_id).to.equal("222");
      let orderItem3Obj = {
        label: "9873452986",
        order_id: "222",
        type: 'wf',
        isbn: "2a2a",
        price: 4.20,
        name: "Skirts",
        quantity: 1
      };
      return labels.insert(orderItem3Obj);
    }).then((item3) => {
      return labels.findByLabel("98734529", { startsWith: true });
    }).then((items) => {
      expect(items.length).to.equal(3);
      done();
    }).catch(m => console.log(m));
  }

  //Search
  @test("should search by order id")
  public testSearchOrderId(done) {
    let labels = LabelTest.labels;
    let orderItem = {
      label: "19873452986",
      isbn: "324",
      type: "wf",
      price: 10.00,
      name: "Washfold",
      quantity: 1
    };

    labels.insert(orderItem).then((item) => {
      return labels.findByLabel("19873452986");
    }).then((items) => {
      expect(items.length).to.equal(1);
      expect(items[0].price).to.equal(10);
      expect(items[0].isbn).to.equal("324");
      expect(items[0].label).to.equal("19873452986");
      done();
    }).catch(m => console.log(m));
  }

  //Update
  @test("should not update order_id")
  public testUpdateOrderId(done) {
    let labels = LabelTest.labels;
    let orderItemObj = {
      label: "9847594875",
      order_id: "3a3",
      type: "wf",
      isbn: "1234",
      price: 10.00,
      name: "Washfold",
      quantity: 1
    };
    labels.insert(orderItemObj).then((item) => {
      expect(item.order_id).to.equal("3a3");
      let orderItemUpdated = {
        order_id: "4a4",
      }
      return labels.update(item, orderItemUpdated);
    }).then(() => {
      return labels.findByLabel("9847594875");
    }).then((items) => {
      expect(items[0].order_id).to.equal("4a4");
      done();
    }).catch(done);
  }
}

