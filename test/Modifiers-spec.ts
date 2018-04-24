import { ApplicationSettings } from 'pouchable';
import { suite, test, timeout } from "mocha-typescript";
import * as chai from 'chai';
import * as PouchDB from 'pouchdb';
import * as _ from 'lodash';
import { Modifiers } from '../src/config/Modifiers';

const expect = chai.expect;

@suite("Modifiers test")
class ModifiersTest {

  static db;
  static appSettings: ApplicationSettings;

  static before() {
    ModifiersTest.db = new PouchDB("default");
    ModifiersTest.appSettings = new ApplicationSettings(ModifiersTest.db);
  }

  static after(done: Function) {
    ModifiersTest.db.destroy(() => done());
  }

  @test("should create new store config")
  public testInstantiate() {
      let ic = new Modifiers(ModifiersTest.appSettings);
      expect(ic).to.not.equal(null);
  }

  @test("should save and load store config")
  public testSaveAndLoad(done: Function) {
      let ic = new Modifiers(ModifiersTest.appSettings);
      let data = {};
      data['isbn'] = 'group-a'
      data['name'] = 'name'
      data['price'] = 10.2;
      data['priority'] = 1;
      
      ic.save([data]).then((modifiers: Modifiers) => {
        return modifiers.reload();
      }).then((modifiers) => {
        let groupA = modifiers.findBy('group-a');
        expect(groupA.length).to.equal(1);
        done()
      }).catch((err) => {
        console.log(err);
        expect(err).to.equal(null);
      })
  }
}