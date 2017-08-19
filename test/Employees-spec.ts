import { ApplicationSettings } from 'pouchable';
import { suite, test, timeout } from "mocha-typescript";
import * as chai from 'chai';
import * as PouchDB from 'pouchdb';
import * as _ from 'lodash';
import { Employee, Employees } from '../src/config/Employees';

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
      let data = [{"id":7,"store_id":"test","name":"C Heiman","formatted_mobile":"16465110569","role":1,"pincode":"138311","active":1,"email":"hbarr@sudzy.co","address":"199 Orchard Street, Apt. 2F, New York","birthday":"1990-12-18T05:00:00.000Z","started_at":"2016-12-31T05:00:00.000Z","ended_at":"2017-09-30T04:00:00.000Z"},{"id":8,"store_id":"test","name":"Adam B.","formatted_mobile":"16468573245","role":2,"pincode":"234567","active":1,"email":"ganoro@gmail.com","address":"23 e 109th","birthday":"2017-03-07T05:00:00.000Z","started_at":"0000-00-00","ended_at":null},{"id":9,"store_id":"test","name":"Maria Kerry","formatted_mobile":"16465447695","role":4,"pincode":"419095","active":0,"email":null,"address":null,"birthday":null,"started_at":null,"ended_at":null}]
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
}