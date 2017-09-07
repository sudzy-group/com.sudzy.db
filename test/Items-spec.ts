import { ApplicationSettings } from 'pouchable';
import { suite, test, timeout } from "mocha-typescript";
import * as chai from 'chai';
import * as PouchDB from 'pouchdb';
import * as _ from 'lodash';
import { Item, Items } from '../src/config/Items';

const expect = chai.expect;

@suite("Items test")
class ItemsTest {

  static db;
  static appSettings: ApplicationSettings;

  static before() {
    ItemsTest.db = new PouchDB("default");
    ItemsTest.appSettings = new ApplicationSettings(ItemsTest.db);
  }

  static after(done: Function) {
    ItemsTest.db.destroy(() => done());
  }

  @test("should create new store config")
  public testInstantiate() {
      let ic = new Items(ItemsTest.appSettings);
      expect(ic).to.not.equal(null);
  }

  @test("should save and load store config")
  public testSaveAndLoad(done: Function) {
      let ic = new Items(ItemsTest.appSettings);
      let data = {};
      data['isbn'] = 'it-001'
      data['type'] = 'wf'
      data['name'] = 'name'
      data['measurement'] = 'pound'
      data['data_uri'] = 'data_uri'
      data['default_quantity'] = 1
      data['hidden'] = false;
      data['price'] = 10.2;
      data['priority'] = 1;
      data['pricing_group'] = 1;
      data['parent_isbn'] = 1;
      
      ic.save({'it-001': data }).then((items: Items) => {
        return items.reload();
      }).then((items) => {
        let item: Item = items.get('it-001')
        expect(item).to.not.equal(undefined);
        expect(item.isbn).to.not.equal(undefined);
        expect(item.type).to.not.equal(undefined);
        expect(item.name).to.not.equal(undefined);
        expect(item.measurement).to.not.equal(undefined);
        expect(item.data_uri).to.not.equal(undefined);
        expect(item.default_quantity).to.not.equal(undefined);
        expect(item.hidden).to.not.equal(undefined);
        expect(item.price).to.not.equal(undefined);
        expect(item.priority).to.not.equal(undefined);
        expect(item.first_x).to.equal(undefined);
        expect(item.first_x_price).to.equal(undefined);
        expect(item.pricing_group).to.equal(1);
        expect(item.parent_isbn).to.equal(1);
        let keys = items.keys();
        expect(keys.length).to.equal(1);
        done()
      }).catch((err) => {
        console.log(err);
        expect(err).to.equal(null);
      })
  }
}