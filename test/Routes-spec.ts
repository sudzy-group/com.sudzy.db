import { ApplicationSettings } from 'pouchable';
import { suite, test, timeout } from "mocha-typescript";
import * as chai from 'chai';
import * as PouchDB from 'pouchdb';
import * as _ from 'lodash';
import { Route, Routes } from '../src/config/Routes';

const expect = chai.expect;

@suite("Routes test")
class RoutesTest {

  static db;
  static appSettings: ApplicationSettings;

  static before() {
    RoutesTest.db = new PouchDB("default");
    RoutesTest.appSettings = new ApplicationSettings(RoutesTest.db);
  }

  static after(done: Function) {
    RoutesTest.db.destroy(() => done());
  }

  @test("should create new store config")
  public testInstantiate() {
      let ic = new Routes(RoutesTest.appSettings);
      expect(ic).to.not.equal(null);
  }

  @test("should save and load store config")
  public testSaveAndLoad(done: Function) {
      let ic = new Routes(RoutesTest.appSettings);
      let data = [{"id":1,"store_id":"aa0c19ba","name":"My Weekly Route","description":"","day_of_week":"Wednesday","starts_at":"10:00 AM","ends_at":"02:00 PM","timezone":"America/New_York","text_day":"Tuesday","text_hour":"07:00 PM","text_template":"hello {{name}}, tomorrow morning I will be in your area, please be reminded to leave the bag out of your door if you won't be home. thank you {{store}}","is_enabled":1}];
      ic.save(data).then((routes: Routes) => {
        return routes.reload();
      }).then((routes) => {
        let route: Route = routes.get(1)
        expect(route).to.not.equal(undefined);
        expect(route.name).to.not.equal(undefined);
        let keys = routes.keys();
        expect(keys.length).to.equal(1);
        done()
      }).catch((err) => {
        console.log(err);
        expect(err).to.equal(null);
      })
  }
}