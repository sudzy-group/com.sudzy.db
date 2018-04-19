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
 * node lib/tools/deleteCustomer.js --remotePouchDB ****:5984 --remotePouchDBUser *** --remotePouchDBPassword *** --storeId *** --id ***
 */
let p = commander
  .version('0.0.1')
  .usage('[options]')
  .option('-p, --remotePouchDB [value]', 'The remote PouchDB url')
  .option('-U, --remotePouchDBUser [value]', 'The remote PouchDB user')
  .option('-P, --remotePouchDBPassword [value]', 'The remote PouchDB password')
	.option('-s, --storeId [value]', 'The store user')
	.option('-i, --id [value]', 'The customers id')
	.parse(process.argv);

if (!p.remotePouchDB || !p.storeId) {
   console.error('no databases arguments given.');
   process.exit(1);
}

let util = PhoneNumberUtil.getInstance();
let countryCode = "+1";
let region = "US";

var pouch, customers: Customers, orders: Orders;

function getConnection() {
  return new PouchDB(p.remotePouchDB + "/" + p.storeId, {
    auth: {
        username: p.storeId,
        password: p.storeId
    }
  });
}


let database = new Database('default');

connectPouch( () => {
	console.log('checking if safe delete of ', p.id);
	safeDelete(p.id, c => {
		if (!c) {
			console.log('not safe to remove customer - exiting');
			return;
		}
		console.log('safe delete - found ', c.id, c.name);
		customers.remove(c).then(() => {
			console.log('removed');
			console.log('sync started: ');
			database.sync().on('complete', () => {
				console.log('sync done');
			}).on('change', m => { 
				console.log("updating")		
			}).on('error', m => console.log(m));
		})
	})	
});

function connectPouch(callback) {
	console.log("remote pouch db", p.remotePouchDB);
	var pouch = getConnection();
	customers = new Customers(pouch, Customer);
	orders = new Orders(pouch, Order);
	callback();
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

function safeDelete(id, callback) {
	customers.get(id).then(c => {
		if (!c) {
			console.log("missing customer", id);
			return callback();
		}
		console.log("searching for orders with customer id", id);
		orders.find('customer_id', id).then(os => {
			if (os.length == 0) {
				return callback(c);
			}
			return callback();
		})
	})

}
