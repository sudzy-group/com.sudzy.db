#!/usr/bin/env node
import * as PouchDB from 'pouchdb';
import * as PouchableAuthentication from 'pouchdb-authentication';
PouchDB.plugin(PouchableAuthentication);

import * as _ from 'lodash';
import * as mysql from 'mysql';
import Promise from 'ts-promise';
import * as async from 'async';
import * as moment from 'moment';

import { Timesheets } from '../collections/Timesheets';
import { Tasks } from '../collections/Tasks';
import { TaskDatas } from '../collections/TaskDatas';

import { Timesheet } from '../entities/Timesheet';
import { Task } from '../entities/Task';
import { TaskData } from '../entities/TaskData';

import { Database } from '../access/Database';
import * as commander from 'commander';

const SKIP_INTERVAL = 500;

let p = commander
  .version('0.0.1')
  .usage('[options]')
  .option('-p, --remotePouchDB [value]', 'The remote PouchDB url')
  .option('-U, --remotePouchDBUser [value]', 'The remote PouchDB user')
  .option('-P, --remotePouchDBPassword [value]', 'The remote PouchDB password')
  .option('-h, --remoteMySQLHost [value]', 'The remote MySQL Host argument')
	.option('-u, --remoteMySQLUser [value]', 'The remote MySQL User argument')
	.option('-w, --remoteMySQLPassword [value]', 'The remote MySQL Password argument')
	.option('-d, --remoteMySQLDatabase [value]', 'The remote MySQL Database argument')
	.option('-s, --storeId [value]', 'The store id argument')
	.parse(process.argv);


if (!p.remotePouchDB || !p.remoteMySQLHost || !p.remoteMySQLUser ||!p.remoteMySQLDatabase || !p.storeId) {
   console.error('no databases arguments given.');
   process.exit(1);
}

var pouch;
var timesheets, tasks, taskDatas;
var SQLconnection;

var docs = 0;

connectPouch();
connectSQL();

function connectPouch() {
	console.log("remote pouch db", p.remotePouchDB);
	pouch = new PouchDB(p.remotePouchDB, {
		auth: {
				username: p.remotePouchDBUser,
				password: p.remotePouchDBPassword
		}
	});

	timesheets = new Timesheets(pouch, Timesheet);
	tasks = new Tasks(pouch, Task);
	taskDatas = new TaskDatas(pouch, TaskData);
}

function connectSQL() {
	SQLconnection = mysql.createConnection({
		host: p.remoteMySQLHost,
		user: p.remoteMySQLUser,
		password: p.remoteMySQLPassword,
		database: p.remoteMySQLDatabase,
		multipleStatements: true
	});

	SQLconnection.connect(function(err) {
		if (err) {
			console.error('error connecting to mysql: ' + err.stack);
			return;
		}
		console.log('connected to mysql');
		copyPouchToSQL();
	});
}

function copyPouchToSQL() {

	/////////////////////
	// Customers
	/////////////////////
	pouch.info().then(function(info) {
		console.log(info)
		return extract(timesheets, "event_time", timesheetsConvertor, timesheetsConvertorFields, 'timesheets');
	}).then(() => {
		return extract(tasks, "shift_id", tasksConvertor, tasksConvertorFields, 'tasks');
	}).then(() => {
		return extract(taskDatas, "task_id", taskDatasConvertor, taskDatasConvertorFields, 'task_datas');
	}).then(() => {
		console.log("Disconnecting");
		disconnectSQL();
	}).catch(m => {
		console.log(m);
		disconnectSQL(1);
	});
}

function write_content(arr, filename) {
	var fs = require('fs');
	var file = fs.createWriteStream(filename);
	file.on('error', function(err) { /* error handling */ });
	arr.forEach(function(v) { file.write(v + '\n'); });
	file.end();
}

function extract(collection, field, convertor, convertoFields, keyName) {
	console.log('extracting ' + keyName);
	return new Promise((resolve, reject) => {
		collection.findIds(field, "", { startsWith: true }).then(ids => {
			let l = ids.length;
			let sorted = _.map(ids, 'id');
			sorted.sort(function(a, b){return b>a});
			console.log('total to convert' , l, keyName);
			let skip = 0;
			let ps = [];
			while (l > 0) {
				let find = _.partialRight((callback, skip) => {
					let toLoad = [];
					let values = sorted.splice(0, SKIP_INTERVAL);
					values.forEach(value => {
						toLoad.push(collection.get(value));	
					});
					Promise.all(toLoad).then(result => { 
						console.log('converting...', result.length);
						return insertAll(result, convertor, convertoFields, keyName);
					}).then((r) => {
						callback(null, r);
					}).catch(m=> {
						console.log('error converting...');
						callback(m)
					});						
				}, skip)
				ps.push(find);
				skip += SKIP_INTERVAL;
				l -= SKIP_INTERVAL;
			}
			async.series(ps, (err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			})

		}).catch(reject);
	});
}

function disconnectSQL(status = 0) {
	SQLconnection.destroy();
	process.exit(status);
};

function insertAll(es, convertor, convertoFields, tableName) {
	console.log("Preparing conversion of " + tableName + ".");
	console.log("Entities to convert: ", es.length);

	if (es.length == 0) {
		return Promise.resolve([]);
	}

	let inserts = [];
	_.each(es, e => {
		inserts.push(convertor(e));
	})
	
	return new Promise((resolve, reject) => {
		let query = 'INSERT INTO ' + p.storeId + '_' + tableName +' (' + convertoFields().join(',') + ') VALUES ?';
		let q = SQLconnection.query(query, [inserts], function(error, results, fields) {
			if (error) {
				console.log(error);
			}
			resolve(results);
		});
	})
}


function timesheetsConvertorFields() {
	return [ "original_id", "created_at", "employee_id", "is_clockin", "event_time", "comment" ];
}

function timesheetsConvertor(timesheet: Timesheet) {
	return [
		timesheet.id,
		timesheet.created_at,
		timesheet.employee_id,
		timesheet.is_clockin ? 1 : 0,
		parseInt(timesheet.event_time),
		timesheet.comment
	]
}

function tasksConvertorFields() {
	return [ "original_id", "created_at", "shift_id", "employee_id", "readable_id", "customer_name", "customer_group", 'completed_at', 'duration'];
}

function tasksConvertor(task: Task) {
	return [
		task.id,
		task.created_at,
		task.shift_id,
		task.employee_id,
		task.readable_id,
		task.customer_name,
		task.group || 'DEFAULT',
		task.completed_at,
		task.duration
	]
}

function taskDatasConvertorFields() {
	return [ "original_id", "created_at", "task_id", "field_id", "value"];
}

function taskDatasConvertor(taskData: TaskData) {
	return [
		taskData.id,
		taskData.created_at,
		taskData.task_id,
		taskData.field_id,
		taskData.value 
	]
}

function toString(val) {
	if (!val) {
		return null;
	}
	if (_.isString(val)) {
		return val;
	}
	if (_.isArray(val)) {
		return val.join(', ');
	}
}
