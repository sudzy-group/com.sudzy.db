import { Messages } from "../src/collections/Messages";
import { Message } from "../src/entities/Message";
import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import * as PouchDB from "pouchdb";
import * as _ from "lodash";
import Promise from "ts-promise";

const expect = chai.expect;

@suite("Message test")
class MessageTest {
  static db;
  static messages: Messages;

  before() {
    MessageTest.db = new PouchDB("default");
    MessageTest.messages = new Messages(MessageTest.db, Message);
  }
  after(done: Function) {
    MessageTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const messages = new Messages(MessageTest.db, Message);
    expect(messages.getPrefix()).to.equal("msg");
  }

  //Insert
  @test("should insert message")
  public testInsertPickup(done) {
    let messages = MessageTest.messages;
    messages
      .insert({
        group_id: "123",
        group_name: "Customer",
        sender: "123",
        body: "hello world",
        is_me: false
      })
      .then(message => {
        expect(message.group_id).to.exist;
        expect(message.group_name).to.equal("Customer");
        expect(message.sender).to.equal("123");
        expect(message.body).to.equal("hello world");
        done();
      })
      .catch(m => console.log(m));
  }

  //Search
  @test("should be able to search by timesheet_time")
  public testSearchMessages(done) {
    let messages = MessageTest.messages;
    let ps = [messages
      .insert({
        group_id: "123",
        group_name: "Customer",
        sender: "123",
        body: "hello world",
        is_me: false
      })];
    _.times(300, (i) => {
      let m = this.random(100,200);
      ps.push(messages
        .insert({
          group_id: m,
          group_name: "Customer " + m,
          sender: m,
          body: "hello world" + i,
          is_me: false
        }))
    })
    Promise.all(ps)
      .then(ms => {
        expect(ms.length).to.equal(301);
        return messages.findLatest(0, 50);
      })
      .then(ms => {
        expect(ms.length).to.equal(50);
        return messages.findByGroup("123", 0, 50);
      })
      .then(ms => {
        expect(ms.length).to.be.greaterThan(0);
        done();
      })
      .catch(m => console.log(m));
  }

  private random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }
}
