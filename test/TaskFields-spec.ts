import { ApplicationSettings } from 'pouchable';
import { suite, test, timeout } from "mocha-typescript";
import * as chai from 'chai';
import * as PouchDB from 'pouchdb';
import * as _ from 'lodash';
import { TaskField, TaskFields } from '../src/config/TaskFields';

const expect = chai.expect;

@suite("TaskFields test")
class TaskFieldsTest {

  static db;
  static appSettings: ApplicationSettings;

  static before() {
    TaskFieldsTest.db = new PouchDB("default");
    TaskFieldsTest.appSettings = new ApplicationSettings(TaskFieldsTest.db);
  }

  static after(done: Function) {
    TaskFieldsTest.db.destroy(() => done());
  }

  @test("should create new store config")
  public testInstantiate() {
      let ic = new TaskFields(TaskFieldsTest.appSettings);
      expect(ic).to.not.equal(null);
  }

  @test("should save and load store config")
  public testSaveAndLoad(done: Function) {
      let ic = new TaskFields(TaskFieldsTest.appSettings);
      let data = [{"id":2,"store_id":"aa0c19ba","name":"Dryer #","icon":"machine","type":"int","selections":null,"is_required":1,"is_multiple":1,"is_productivity":0},{"id":3,"store_id":"aa0c19ba","name":"Washing #","icon":"machine","type":"int","selections":null,"is_required":1,"is_multiple":1,"is_productivity":0},{"id":4,"store_id":"aa0c19ba","name":"Weight","icon":"weight1","type":"float","selections":null,"is_required":1,"is_multiple":0,"is_productivity":1}];
      ic.save(data).then((fields: TaskFields) => {
        return fields.reload();
      }).then((fields) => {
        let field: TaskField = fields.get(2)
        expect(field).to.not.equal(undefined);
        expect(field.name).to.not.equal(undefined);
        let keys = fields.keys();
        expect(keys.length).to.equal(3);
        done()
      }).catch((err) => {
        console.log(err);
        expect(err).to.equal(null);
      })
  }
}