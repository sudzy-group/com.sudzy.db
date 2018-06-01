import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Customers } from "../src/collections/Customers";
import { Customer } from "../src/entities/Customer";
import { CustomerCoupon } from "../src/entities/CustomerCoupon";
import { CustomerCoupons } from "../src/collections/CustomerCoupons";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Customer coupon test")
class CustomerCouponsTest {

  static db;
  static customers: Customers;
  static customer_coupons: CustomerCoupons;

  static before() {
    CustomerCouponsTest.db = new PouchDB("default");
    CustomerCouponsTest.customers = new Customers(CustomerCouponsTest.db, Customer);
    CustomerCouponsTest.customer_coupons = new CustomerCoupons(CustomerCouponsTest.db, CustomerCoupon);
  }

  static after(done: Function) {
    CustomerCouponsTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    let customer_coupons = CustomerCouponsTest.customer_coupons;
    expect(customer_coupons.getPrefix()).to.equal("coupon");
  }

  //Insert
  @test("should insert coupon")
  public testInsertCoupon(done) {
    let customers = CustomerCouponsTest.customers;
    let customer_coupons = CustomerCouponsTest.customer_coupons;
    customers.insert({ mobile: "6465490560" }).then((cust) => {
      let couponObj = {
        customer_id: cust.id,
        coupon_id: 1,
        order_id: "order1234"
      }
      return customer_coupons.insert(couponObj);
    }).then((coupon) => {
      expect(coupon.customer_id).to.exist;
      expect(coupon.coupon_id).to.equal(1);
      expect(coupon.order_id).to.equal('order1234');
      done();
    }).catch(m => console.log(m));
  }

  @test("should insert two coupons")
  public testInsertTwoCoupon(done) {
    let customers = CustomerCouponsTest.customers;
    let customer_coupons = CustomerCouponsTest.customer_coupons;
    let customer = null;
    customers.insert({ mobile: "6465490520" }).then((cust) => {
      customer = cust;
      let couponObj1 = {
        customer_id: cust.id,
        coupon_id: 1,
        order_id: "order1234"
      }
      return customer_coupons.insert(couponObj1);
    }).then(() => {
      let couponObj2 = {
        customer_id: customer.id,
        coupon_id: 1,
        order_id: "order1234"
      }
      return customer_coupons.insert(couponObj2);
    }).then(() => {
      done();
    }).catch(m => console.log(m));
  }

  //Search 
  @test("should be searchable by customer id")
  public testSearchByCustomerId(done) {
    let customers = CustomerCouponsTest.customers;
    let customer_coupons = CustomerCouponsTest.customer_coupons;
    customers.insert({ mobile: "6225490560" }).then((cust) => {
      let couponObj = {
        customer_id: cust.id,
        coupon_id: 1,
        order_id: "order1234"
      }
      return customer_coupons.insert(couponObj);
    }).then((coupon) => {
      return customer_coupons.getCoupons(coupon.customer_id)
    }).then((coupons) => {
      expect(coupons.length).to.equal(1);
      return customer_coupons.getCouponUsed(coupons[0].customer_id, coupons[0].coupon_id);
    }).then((coupon) => {
      expect(coupon).to.not.be.null;
      expect(coupon.coupon_id).to.be.equal(1);
      return customer_coupons.getCouponUsed(coupon.customer_id, 736744);
    }).then((coupon) => {
      expect(coupon).to.be.undefined;
      done();
    }).catch(m => console.log(m));
  }
}


