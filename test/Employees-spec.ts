import { ApplicationSettings } from 'pouchable';
import { suite, test, timeout } from "mocha-typescript";
import * as chai from 'chai';
import * as PouchDB from 'pouchdb';
import * as _ from 'lodash';
import { Employee, Employees } from '../src/config/Employees';
import { Discount, Discounts } from '../src/config/Discounts';
import { Promo, Promos } from '../src/config/Promos';

const expect = chai.expect;

@suite("Employees test")
class EmployeesTest {

  static db;
  static appSettings: ApplicationSettings;

  static before() {
    EmployeesTest.db = new PouchDB("default");
    EmployeesTest.appSettings = new ApplicationSettings(EmployeesTest.db);
  }

  static after(done: Function) {
    EmployeesTest.db.destroy(() => done());
  }

  @test("should create new store config")
  public testInstantiate() {
    let ic = new Employees(EmployeesTest.appSettings);
    expect(ic).to.not.equal(null);
  }

  @test("should save and load store config")
  public testSaveAndLoad(done: Function) {
    let ic = new Employees(EmployeesTest.appSettings);
    let data = [{ "id": 7, "store_id": "test", "name": "C Heiman", "formatted_mobile": "16465110569", "role": 1, "pincode": "138311", "active": 1, "email": "hbarr@sudzy.co", "address": "199 Orchard Street, Apt. 2F, New York", "birthday": "1990-12-18T05:00:00.000Z", "started_at": "2016-12-31T05:00:00.000Z", "ended_at": "2017-09-30T04:00:00.000Z" }, { "id": 8, "store_id": "test", "name": "Adam B.", "formatted_mobile": "16468573245", "role": 2, "pincode": "234567", "active": 1, "email": "ganoro@gmail.com", "address": "23 e 109th", "birthday": "2017-03-07T05:00:00.000Z", "started_at": "0000-00-00", "ended_at": null }, { "id": 9, "store_id": "test", "name": "Maria Kerry", "formatted_mobile": "16465447695", "role": 4, "pincode": "419095", "active": 0, "email": null, "address": null, "birthday": null, "started_at": null, "ended_at": null }]
    ic.save(data).then((employees: Employees) => {
      return employees.reload();
    }).then((employees) => {
      let employee: Employee = employees.get('138311')
      expect(employee).to.not.equal(undefined);
      expect(employee.name).to.not.equal(undefined);
      let keys = employees.keys();
      expect(keys.length).to.equal(3);
      done()
    }).catch((err) => {
      console.log(err);
      expect(err).to.equal(null);
    })
  }

  @test("should create discounts new store config")
  public testDicountInstantiate() {
    let ic = new Discounts(EmployeesTest.appSettings);
    expect(ic).to.not.equal(null);
  }

  @test("should save discounts and load store config")
  public testDiscountSaveAndLoad(done: Function) {
    let ic = new Discounts(EmployeesTest.appSettings);
    let data = [{ "id": 1, "store_id": "aa0c19ba", "name": "$9 OFF DC", "item_type": "dc", "type": "fixed", "amount": 9, "is_enabled": 1, "is_hidden": 1, "color": "gray" }, { "id": 2, "store_id": "aa0c19ba", "name": "15% OFF", "item_type": "all", "type": "percent", "amount": 15, "is_enabled": 1, "color": "gray" }];
    ic.save(data).then((discounts: Discounts) => {
      return discounts.reload();
    }).then((employees) => {
      let discount: Discount = employees.get(1)
      expect(discount).to.not.equal(undefined);
      expect(discount.name).to.not.equal(undefined);
      expect(discount.isEnabled).to.equal(1);
      expect(discount.isHidden).to.equal(1);
      expect(discount.itemType).to.equal('dc');
      expect(discount.type).to.equal('fixed');
      expect(discount.amount).to.equal(9);
      expect(discount.color).to.equal('gray');
      let keys = employees.keys();
      expect(keys.length).to.equal(2);
      done()
    }).catch((err) => {
      console.log(err);
      expect(err).to.equal(null);
    })
  }

  @test("should create discounts new store config")
  public testPromoInstantiate() {
    let ic = new Promos(EmployeesTest.appSettings);
    expect(ic).to.not.equal(null);
  }

  @test("should save discounts and load store config")
  public testPromoSaveAndLoad(done: Function) {
    let ic = new Promos(EmployeesTest.appSettings);
    let data = [{ "id": 1, "store_id": "aa0c19ba", "code": "GOOG15", "description": "15% for your first dry cleaning order", "discount_id": 2, "audience": "new", "is_enabled": 0 }];
    ic.save(data).then((promos: Promos) => {
      return promos.reload();
    }).then((promos) => {
      let discount: Promo = promos.get("GOOG15")
      expect(discount).to.not.equal(undefined);
      expect(discount.description).to.not.equal(undefined);
      expect(discount.discountId).to.equal(2);
      expect(discount.audience).to.equal('new');
      expect(discount.isEnabled).to.equal(0);
      let keys = promos.keys();
      expect(keys.length).to.equal(1);
      done()
    }).catch((err) => {
      console.log(err);
      expect(err).to.equal(null);
    })
  }
}