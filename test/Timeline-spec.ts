import { Timelines } from "../src/collections/Timelines";
import { Timeline } from "../src/entities/Timeline";
import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import * as PouchDB from "pouchdb";
import * as _ from "lodash";

const expect = chai.expect;

@suite("Timeline test")
class TimelineTest {
  static db;
  static timelines: Timelines;

  before() {
    TimelineTest.db = new PouchDB("default");
    TimelineTest.timelines = new Timelines(TimelineTest.db, Timeline);
  }
  after(done: Function) {
    TimelineTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const timelines = new Timelines(TimelineTest.db, Timeline);
    expect(timelines.getPrefix()).to.equal("tl");
  }

  //Insert
  @test("should insert pickup")
  public testInsertPickup(done) {
    let timelines = TimelineTest.timelines;
    timelines
      .insert({
        employee_id: "123456",
        operation: 1,
        order_id: "123",
        text: "Hello world!"
      })
      .then(timeline => {
        expect(timeline.employee_id).to.exist;
        expect(timeline.operation).to.equal(1);
        expect(timeline.order_id).to.equal("123");
        expect(timeline.text).to.equal("Hello world!");
        done();
      })
      .catch(m => console.log(m));
  }

  //Search
  @test("should be able to search by timesheet_time")
  public testSearchTimesheetTime(done) {
    let timelines = TimelineTest.timelines;
    timelines
      .insert({
        employee_id: "123456",
        operation: 1,
        order_id: "123",
        text: "Hello world!"
      })
      .then(timeline => {
        return timelines
        .insert({
          employee_id: "123456",
          operation: 2,
          order_id: "123",
          text: "Hello world!"
        });
      })
      .then(timeline => {
        return timelines.findByOrderId("123");
      })
      .then(tss => {
        expect(tss.length).to.equal(2);
        done();
      })
      .catch(m => console.log(m));
  }
}
