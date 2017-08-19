import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Timesheet } from "../src/entities/Timesheet";
import { Timesheets } from "../src/collections/Timesheets";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Timesheet test")
class TimesheetTest {

  static db;
  static timesheets: Timesheets;

  before() {
    TimesheetTest.db = new PouchDB("default");
    TimesheetTest.timesheets = new Timesheets(TimesheetTest.db, Timesheet);
  }
  after(done: Function) {
    TimesheetTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const timesheets = new Timesheets(TimesheetTest.db, Timesheet);
    expect(timesheets.getPrefix()).to.equal("ts");
  }

//Insert

 @test("should insert pickup")
  public testInsertPickup(done) {
    let timesheets = TimesheetTest.timesheets;
    timesheets.insert({ employee_id: "123456", is_clockin: true, event_time: '1503151061505' }).then((timesheet) => {
        expect(timesheet.event_time).to.exist;
        expect(timesheet.is_clockin).to.equal(true);
        done();
    }).catch(m=>console.log(m));
  }

//Search
  @test("should be able to search by timesheet_time")
  public testSearchTimesheetTime(done) {
    let timesheets = TimesheetTest.timesheets;
    timesheets.insert({ employee_id: "123457", is_clockin: true, event_time: '1503151061506' }).then((timesheet) => {
      expect(timesheet.event_time).to.exist;
      expect(timesheet.is_clockin).to.equal(true);
      return timesheets.find("employee_id", "123457")
     }).then((tss) => {   
        expect(tss.length).to.equal(1);
        done();
    }).catch(m=>console.log(m));
  } 

  @test("should be able to search by event_time")
  public testSearchTimesheetTime2(done) {
    let timesheets = TimesheetTest.timesheets;
    timesheets.insert({ employee_id: "123458", is_clockin: true, event_time: '1503151061507' }).then((timesheet) => {
      expect(timesheet.event_time).to.exist;
      expect(timesheet.is_clockin).to.equal(true);
      return timesheets.findIds('event_time', '', { startkey: '1503151061000', gte: true })
     }).then((tss) => {   
        expect(tss.length).to.be.greaterThan(0);
        done();
    }).catch(m=>console.log(m));
  } 


}

