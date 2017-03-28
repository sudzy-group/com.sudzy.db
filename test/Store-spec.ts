import { ApplicationSettings } from 'pouchable';
import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import { Store } from '../src/config/Store';

const expect = chai.expect;

@suite("Store test")
class StoreTest {

  static db;
  static appSettings: ApplicationSettings;

  static before() {
    StoreTest.db = new PouchDB("default");
    StoreTest.appSettings = new ApplicationSettings(StoreTest.db);
  }

  static after(done: Function) {
    StoreTest.db.destroy(() => done());
  }

  @test("should create new store config")
  public testInstantiate() {
      let sc = new Store(StoreTest.appSettings);
      expect(sc).to.not.equal(null);
  }

  @test("should save and load store config")
  public testSaveAndLoad(done: Function) {
      let sc = new Store(StoreTest.appSettings);
      sc.save({ id: 'aa'}).then((store: Store) => {
        return store.reload();
      }).then((store) => {
        expect(store.id).to.equal('aa');
        done()
      }).catch((err) => {
        console.log(err);
        expect(err).to.equal(null);
      })
  }

}