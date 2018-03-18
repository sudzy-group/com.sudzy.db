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

import { Customer } from "../entities/Customer";
import { CustomerCard } from "../entities/CustomerCard";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { OrderTag } from "../entities/OrderTag";
import { OrderCharge } from "../entities/OrderCharge";
import { Delivery } from "../entities/Delivery";
import { Database } from '../access/Database';
import * as commander from 'commander';

/**
 * Example: 
 * node lib/tools/importCustomers.js --remotePouchDB ****:5984 --remotePouchDBUser *** --remotePouchDBPassword *** --storeId *** --customersFile ***
 */
let p = commander
  .version('0.0.1')
  .usage('[options]')
  .option('-p, --remotePouchDB [value]', 'The remote PouchDB url')
  .option('-U, --remotePouchDBUser [value]', 'The remote PouchDB user')
  .option('-P, --remotePouchDBPassword [value]', 'The remote PouchDB password')
	.option('-s, --storeId [value]', 'The store user')
	.option('-f, --customersFile [value]', 'The customers csv file')
	.parse(process.argv);

if (!p.remotePouchDB || !p.storeId) {
   console.error('no databases arguments given.');
   process.exit(1);
}

let util = PhoneNumberUtil.getInstance();
let countryCode = "+1";
let region = "US";

var pouch, customers: Customers;
let database = new Database('default');

connectPouch( () => {
	loadCustomers(cs => {
		
		let ps = [];
		cs.forEach(c => {
			c.mobile = c.mobile.toString();

			if (c.mobile.length != 10 || c.name.length < 2) {
				console.log("skipped line, no name or mobile", c.name, c.mobile)
				return;
			}
			c.created_at = new Date(c.created_at).getTime();
			let customer = {
				name: c.name,
				mobile: c.mobile,
				formatted_mobile: format(c.mobile),
			}
			if (!_.isEmpty(c.email)) {
				customer['email'] = c.email;
			}
			if (c.autocomplete) {
				customer['autocomplete'] = c.autocomplete;
			}
			if (c.route_id) {
				customer['route_id'] = c.route_id.toString();
			}
			if (c.pricing_group) {
				customer['pricing_group'] = c.pricing_group;
			}
			if (c.lat) {
				customer['street_num'] = c.street_num;
				customer['street_route'] = c.street_route;
				customer['city'] = c.city;
				customer['state'] = c.state;
				if (!_.isEmpty(c.zip)) {
					customer['zip'] = c.zip;
				}
				customer['lat'] = c.lat;
				customer['lng'] = c.lng;
				customer['apartment'] = c.apartment;
			}
			if (c.delivery_notes) {
				customer['delivery_notes'] = c.delivery_notes;
			}
			if (c.cleaning_notes) {
				customer['cleaning_notes'] = c.cleaning_notes;
			}
			ps.push(customers.insert(customer, c.created_at)) ;
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
			customers = new Customers(database.db, Customer);
			callback();
		}).on('change', m => { 
			console.log("updating")		
		}).on('error', m => console.log(m));
	}).catch(m => console.log(m));
}

function loadCustomers(callback) {
	let customer = [];
	csv()
	.fromFile(p.customersFile)
	.on('json',(jsonObj)=>{
		customer.push(jsonObj);
	})
	.on('done',(error)=>{
		callback(customer);
	})
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

function format(value) {
	if (!value) { return '' };
	if (value[0] != '+') {
      value = countryCode + value;
	}

	let parsed = util.parse(value, region);
	let formatted = util.format(parsed, 2);
	return formatted;
}
