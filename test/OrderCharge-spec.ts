import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { OrderCharge } from "../src/entities/OrderCharge";
import { OrderCharges } from "../src/collections/OrderCharges";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Order charge test")
class OrderChargeTest {

  static db;
  static order_charges: OrderCharges;

  static before() {
    OrderChargeTest.db = new PouchDB("default");
    OrderChargeTest.order_charges = new OrderCharges(OrderChargeTest.db, OrderCharge);
  }

  static after(done: Function) {
    OrderChargeTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    let order_charges = OrderChargeTest.order_charges;
    expect(order_charges.getPrefix()).to.equal("order-charge");
  }


  //Insert

  @test("should insert charge")
  public testInsertCharge(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
      order_id: "1",
      amount: 100.00,
      charge_type: "other"
    };
    order_charges.insert(orderChargeObj).then((charge) => {
      expect(charge.order_id).to.equal("1");
      expect(charge.amount).to.equal(100.00);
      done();
    }).catch(_.noop);
  }


  // @test("should insert card charge")
  // public testInsertCardCharge(done) {
  //   let order_charges = OrderChargeTest.order_charges;
  //   let orderChargeObj = {
  //     order_id: "2",
  //     charge_id: "ch_22252VDMuhhpO1mOP08I3P3B",
  //     amount: 100.00,
  //     charge_type: "card",
  //     card_id: "cd_249492_aa"
  //   };
  //   order_charges.insert(orderChargeObj).then((charge) => {
  //     expect(charge.order_id).to.equal("2");
  //     expect(charge.card_id).to.equal("cd_249492_aa");
  //     done();
  //   }).catch(_.noop);
  // }

  // @test("should insert cash charge")
  // public testInsertCashCharge(done) {
  //   let order_charges = OrderChargeTest.order_charges;
  //   let orderChargeObj = {
  //     order_id: "3",
  //     charge_id: "ch_33352VDMuhhpO1mOP08I3P3B",
  //     amount: 100.00,
  //     charge_type: "cash",
  //     date_cash: "1489710720493"
  //   };
  //   order_charges.insert(orderChargeObj).then((charge) => {
  //     expect(charge.order_id).to.equal("3");
  //     expect(charge.charge_type).to.equal("cash");
  //     expect(charge.date_cash).to.equal("1489710720493");
  //     done();
  //   }).catch(_.noop);
  // }


  // // //Search
  // @test("should search by order_id")
  // public testSearchOrderId(done) {
  //   let order_charges = OrderChargeTest.order_charges;
  //   let orderChargeObj = {
  //     order_id: "4",
  //     amount: 100.00,
  //     charge_type: "other"
  //   };
  //   order_charges.insert(orderChargeObj).then((charge) => {
  //     expect(charge.amount).to.equal(100.00);
  //     return order_charges.find("order_id", charge.order_id);
  //   }).then((charges) => {
  //     expect(charges.length).to.equal(1);
  //     done();
  //   }).catch(_.noop);
  // }


  // @test("should not update non-refund card attributes")
  // public testNotCardUpdate(done) {
  //   let order_charges = OrderChargeTest.order_charges;
  //   let chargeObj = {
  //     order_id: "xax",
  //     amount: 250.00,
  //     charge_type: "credit"
  //   }
  //   order_charges.insert(chargeObj).then((charge) => {
  //     expect(charge.order_id).to.equal("xax");
  //     let chargeUpdated = {
  //       order_id: "2xax",
  //       card_id: "2wgw",
  //       amount: 150.00,
  //       charge_type: "cash"
  //     }
  //     return order_charges.update(charge, chargeUpdated);
  //   }).then(_.noop)
  //     .catch((c) => {
  //       done();
  //     });
  // }

  // @test("should not update non-refund cash attributes")
  // public testNotCashUpdate(done) {
  //   let order_charges = OrderChargeTest.order_charges;
  //   let chargeObj = {
  //     order_id: "bax",
  //     amount: 250.00,
  //     charge_id: "ch_bbb",
  //     charge_type: "cash",
  //     date_cash: "1489710720493"
  //   }
  //   order_charges.insert(chargeObj).then((charge) => {
  //     expect(charge.order_id).to.equal("xax");
  //     let chargeUpdated = {
  //       order_id: "eax",
  //       amount: 250.00,
  //       charge_id: "ch_ebb",
  //       charge_type: "credit",
  //       date_cash: "1419710720493"
  //     }
  //     return order_charges.update(charge, chargeUpdated);
  //   }).then(_.noop)
  //     .catch((c) => {
  //       done();
  //     });
  // }

  // @test("should update refunded cash attributes")
  // public testCashRefund(done) {
  //   let order_charges = OrderChargeTest.order_charges;
  //   let chargeObj = {
  //     order_id: "hax",
  //     amount: 150.00,
  //     charge_id: "ch_hhh",
  //     charge_type: "cash",
  //     date_cash: "1489710720493"
  //   }
  //   order_charges.insert(chargeObj).then((charge) => {
  //     expect(charge.order_id).to.equal("hax");
  //     let chargeUpdated = {
  //       amount_refunded: 100.00,
  //       refund_id: "f932"
  //     }
  //     return order_charges.update(charge, chargeUpdated);
  //   }).then((updatedCharge) => {
  //     expect(updatedCharge.amount_refunded).to.equal(100.00);
  //     expect(updatedCharge.refund_id).to.equal("f932");
  //     done();
  //   }).catch(_.noop);
  // }

  // @test("should update refunded card attributes")
  // public testCardRefund(done) {
  //   let order_charges = OrderChargeTest.order_charges;
  //   let chargeObj = {
  //     order_id: "554",
  //     charge_id: "ch_2452VDMuhhpO1mOP08I3P3B",
  //     amount: 100.00,
  //     charge_type: "card",
  //     card_id: "cd_449492_aa"
  //   }
  //   order_charges.insert(chargeObj).then((charge) => {
  //     expect(charge.order_id).to.equal("hax");
  //     let chargeUpdated = {
  //       amount_refunded: 100.00,
  //       refund_id: "f932"
  //     }
  //     return order_charges.update(charge, chargeUpdated);
  //   }).then((updatedCharge) => {
  //     expect(updatedCharge.amount_refunded).to.equal(100.00);
  //     expect(updatedCharge.refund_id).to.equal("f932");
  //     done();
  //   }).catch(_.noop);
  // }

  // // //Delete
  // @test("should delete charge")
  // public testDeleteCharge(done) {
  //   let order_charges = OrderChargeTest.order_charges;
  //   let chargeObj = {
  //     order_id: "fax",
  //     amount: 250.00,
  //     charge_id: "ch_fbb",
  //     charge_type: "cash",
  //     date_cash: "1489710720493"
  //   }
  //   let id = "";
  //   order_charges.insert(chargeObj).then((charge) => {
  //     id = charge.id;
  //     return order_charges.remove(charge);
  //   }).then((e) => {
  //     return order_charges.get(id);
  //   }).then(_.noop)
  //     .catch((c) => {
  //       done();
  //     });
  // }


  // //Validators

}



