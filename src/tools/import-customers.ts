#!/usr/bin/env node

import * as PouchDB from "pouchdb";
import * as PouchableAuthentication from 'pouchdb-authentication';
PouchDB.plugin(PouchableAuthentication);

import * as fs from 'fs';
import * as csv from 'fast-csv';

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

var pouch, customers;

loadCustomers(cs => {
	connectPouch();
	console.log(cs);
});

function connectPouch() {
	console.log("remote pouch db", p.remotePouchDB);
	pouch = new PouchDB(p.remotePouchDB, {
		auth: {
				username: p.remotePouchDBUser,
				password: p.remotePouchDBPassword
		}
	});

	customers = new Customers(pouch, Customer);
}

function loadCustomers(callback) {
	let customer = [];
	var stream = fs.createReadStream(p.customersFile);
	var csvStream = csv()
			.on("data", function(data){
					customer.push(data);
			})
			.on("end", function(){
					callback(customer);
			});
	
	stream.pipe(csvStream);
}

function customerConvertor(customer: Customer) {
		return {
			original_id: customer.id,
			created_at: new Date(customer._base.core.created_at),
			allow_notifications: customer.allow_notifications ? 1 : 0,
			formatted_mobile: customer.formatted_mobile,
			mobile: customer.mobile,
			name: customer.name,
			email: customer.email,
			autocomplete: customer.autocomplete,
			street_num: customer.street_num,
			street_route: customer.street_route,
			apartment: customer.apartment,
			city: customer.city,
			state: customer.state,
			zip: customer.zip,
			lat: customer.lat,
			lng: customer.lng,
			delivery_notes: customer.delivery_notes,
			cleaning_notes: customer.cleaning_notes,
			payment_customer_id: customer.payment_customer_id,
			is_doorman: customer.is_doorman ? 1 : 0
		};
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
