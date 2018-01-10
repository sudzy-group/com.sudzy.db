import { Tasks } from "../src/collections/Tasks";
import { Task } from "../src/entities/Task";
import { TaskDatas } from "../src/collections/TaskDatas";
import { TaskData } from "../src/entities/TaskData";

import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import * as PouchDB from "pouchdb";
import * as _ from "lodash";

const expect = chai.expect;

@suite("Task test")
class TaskTest {
  static db;
  static tasks: Tasks;
  static taskDatas: TaskDatas;

  before() {
    TaskTest.db = new PouchDB("default");
    TaskTest.tasks = new Tasks(TaskTest.db, Task);
    TaskTest.taskDatas = new TaskDatas(TaskTest.db, TaskData);
  }
  after(done: Function) {
    TaskTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const tasks = new Tasks(TaskTest.db, Task);
    expect(tasks.getPrefix()).to.equal("task");
    const taskDatas = new TaskDatas(TaskTest.db, TaskData);
    expect(taskDatas.getPrefix()).to.equal("tdata");
  }

  //Insert
  @test("should insert task")
  public testInsertTask(done) {
    let tasks = TaskTest.tasks;
    tasks
      .insert({
        readable_id: "abc",
        shift_id: "32737862",
        customer_name: "Roy",
        group: "Hello world",
        employee_id: "34",
        completed_at: 2323213213,
        duration: 32432432
      })
      .then(task => {
        expect(task.employee_id).to.exist;
        expect(task.shift_id).to.equal("32737862");
        expect(task.readable_id).to.equal("abc");
        expect(task.group).to.equal("Hello world");
        expect(task.completed_at).to.equal(2323213213);
        expect(task.duration).to.equal(32432432);
        done();
      })
      .catch(m => console.log(m));
  }

  @test("should insert task")
  public testInsertTaskData(done) {
    let taskDatas = TaskTest.taskDatas;
    taskDatas
      .insert({
        task_id: "abc",
        field_id: "abc",
        value: "1234",
      })
      .then(taskDatas => {
        expect(taskDatas.task_id).to.exist;
        expect(taskDatas.task_id).to.equal("abc");
        expect(taskDatas.field_id).to.equal("abc");
        expect(taskDatas.value).to.equal("1234");
        done();
      })
      .catch(m => console.log(m));
  }  

  //Search
  @test("should be able to search by shift id")
  public testSearchTask(done) {
    let tasks = TaskTest.tasks;
    tasks
      .insert({
        readable_id: "abc",
        shift_id: "32737862",
        customer_name: "Roy",
        group: "Hello world",
        employee_id: "34"
      })
      .then(task => {
        return tasks
        .insert({
          readable_id: "abc1",
          shift_id: "32737862",
          customer_name: "Roy",
          group: "Hello world1",
          employee_id: "34"
          });
      })
      .then(task => {
        return tasks.findByShiftIt("32737862");
      })
      .then(tss => {
        expect(tss.length).to.equal(2);
        done();
      })
      .catch(m => console.log(m));
  }

  @test("should be able to search by task id")
  public testSearchTaskData(done) {
    let taskDatas = TaskTest.taskDatas;
    taskDatas
      .insert({
        task_id: "abc",
        field_id: "sds",
        value: 1234,
      })
      .then(taskData => {
        return taskDatas
        .insert({
          task_id: "abc",
          field_id: "abc",
          value: "1234",
        });
      })
      .then(taskData => {
        return taskDatas.findByTaskId("abc");
      })
      .then(tss => {
        expect(tss.length).to.equal(2);
        done();
      })
      .catch(m => console.log(m));
  }  
}
