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
 * node lib/tools/updateCustomers.js --remotePouchDB ****:5984 --remotePouchDBUser *** --remotePouchDBPassword *** --storeId *** --customersFile ***
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

connectPouch(() => {
	loadCustomers(cs => {
		console.log('start searching customers')
		let i = 0;
		let done = () => {
			i++;
			if (i < cs.length) {
				doUpdate(cs[i], done);
			}
		}
		doUpdate(cs[0], done)
	});
});

function doUpdate(c, done) {
	c.mobile = c.mobile.toString();
	console.log('searching for', c.mobile);
	if (_.isEmpty(c.extra_mobile)) {
		return done();
	}
	let update = { extra_mobile: c.extra_mobile }
	customers.find('mobile', c.mobile, { limit: 1}).then(cs => {
		if (cs && cs.length == 1) {
			console.log('updating', update);
			return customers.update(cs[0], update);
		}
		done();
	}).then(done)
	.catch(done);
}

function connectPouch(callback) {
	console.log("remote pouch db", p.remotePouchDB, p.remotePouchDBUser, p.remotePouchDBPassword);
	customers = new Customers(new PouchDB(p.remotePouchDB + '/' + p.remotePouchDBUser, {
		auth: {
			username: p.remotePouchDBUser,
			password: p.remotePouchDBPassword
		}
	}), Customer);
	callback();
}

function loadCustomers(callback) {
	let customer = [];
	csv()
		.fromFile(p.customersFile)
		.on('json', (jsonObj) => {
			customer.push(jsonObj);
		})
		.on('done', (error) => {
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
