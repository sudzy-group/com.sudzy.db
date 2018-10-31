import * as PouchDB from "pouchdb";
import * as PouchableAuthentication from 'pouchdb-authentication';
PouchDB.plugin(PouchableAuthentication);

import * as csv from 'csvtojson';
import { PhoneNumberUtil } from 'google-libphonenumber';

import * as _ from 'lodash';
import Promise from "ts-promise";
import * as mysql from "mysql";

import { Customers } from "../collections/Customers";
import { CustomerCards } from "../collections/CustomerCards";
import { Orders } from "../collections/Orders";
import { OrderItems } from "../collections/OrderItems";
import { OrderTags } from "../collections/OrderTags";
import { OrderCharges } from "../collections/OrderCharges";
import { Deliveries } from "../collections/Deliveries";
import { Labels } from "../collections/Labels";

import { Customer } from "../entities/Customer";
import { CustomerCard } from "../entities/CustomerCard";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { OrderTag } from "../entities/OrderTag";
import { OrderCharge } from "../entities/OrderCharge";
import { Delivery } from "../entities/Delivery";
import { Label } from "../entities/Label";
import { Database } from '../access/Database';
import * as commander from 'commander';

/**
 * Example: 
 * node lib/tools/importLabels.js --remotePouchDB ****:5984 --remotePouchDBUser *** --remotePouchDBPassword *** --storeId *** --labelsFile ***
 */
let p = commander
  .version('0.0.1')
  .usage('[options]')
  .option('-p, --remotePouchDB [value]', 'The remote PouchDB url')
  .option('-U, --remotePouchDBUser [value]', 'The remote PouchDB user')
  .option('-P, --remotePouchDBPassword [value]', 'The remote PouchDB password')
	.option('-s, --storeId [value]', 'The store user')
	.option('-f, --labelsFile [value]', 'The labels csv file')
	.parse(process.argv);

if (!p.remotePouchDB || !p.storeId) {
   console.error('no databases arguments given.');
   process.exit(1);
}

let util = PhoneNumberUtil.getInstance();
let countryCode = "+1";
let region = "US";

var pouch, labels: Labels;
let database = new Database('default');

connectPouch( () => {
	loadLabels(lbs => {
		
		let ps = [];
		lbs.forEach(lb => {
			if (lb.label.length < 1) {
				console.log("skipped line, no label", lb.label)
				return;
			}
			lb.created_at = new Date(lb.created_at).getTime();
			let label = {
				label: lb.label,
				isbn: lb.isbn,
			}
			if (lb.type) {
				label['type'] = lb.type;
			}
			if (lb.name) {
				label['name'] = lb.name;
			}
			if (lb.quantity) {
				label['quantity'] = lb.quantity;
			}
			if (lb.price) {
				label['price'] = lb.price;
			}
			if (lb.is_manual_pricing) {
				label['is_manual_pricing'] = lb.is_manual_pricing;
			}
			if (lb.notes) {
				label['notes'] = lb.notes;
			}
			if (lb.extra) {
				label['extra'] = lb.extra;
			}
			if (lb.order_id) {
				label['order_id'] = lb.order_id;
			}
			ps.push(labels.insert(label, lb.created_at)) ;
		});
		console.log('sync started: ', ps.length);
		Promise.all(ps).then(
			css => {
				database.sync().on('complete', () => {
					console.log('sync done');
				}).on('change', m => { 
					console.log("updating")		
				}).on('error', m => console.log(m));
			}
		).catch(m=> console.log(m));
	});
});

function connectPouch(callback) {
	console.log("remote pouch db", p.remotePouchDB);
	database.connect(p.remotePouchDB, p.storeId, p.remotePouchDBUser, p.remotePouchDBPassword).then(() => {
		database.sync().on('complete', () => {
			labels = new Labels(database.db, Label);
			callback();
		}).on('change', m => { 
			console.log("updating")		
		}).on('error', m => console.log(m));
	}).catch(m => console.log(m));
}

function loadLabels(callback) {
	let label = [];
	csv()
	.fromFile(p.labelsFile)
	.on('json',(jsonObj)=>{
		label.push(jsonObj);
	})
	.on('done',(error)=>{
		callback(label);
	})
}
