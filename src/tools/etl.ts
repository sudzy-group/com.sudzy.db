#!/usr/bin/env node
import * as PouchDB from "pouchdb";
import * as PouchableAuthentication from 'pouchdb-authentication';
PouchDB.plugin(PouchableAuthentication);

import * as _ from 'lodash';
import * as mysql from 'mysql';
import Promise from 'ts-promise';
import * as async from "async";

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
var customers: Customers, customer_cards, orders, deliveries, order_items, order_tags, order_charges;
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

	customers = new Customers(pouch, Customer);
	customer_cards = new CustomerCards(pouch, CustomerCard);
	orders = new Orders(pouch, Order);
	deliveries = new Deliveries(pouch, Delivery);
	order_items = new OrderItems(pouch, OrderItem);
	order_tags = new OrderTags(pouch, OrderTag);
	order_charges = new OrderCharges(pouch, OrderCharge);
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
		return extract(customers, "mobile", customerConvertor, customerConvertorFields, 'customers');
	}).then(() => {
		return extract(customer_cards, "customer_id", customerCardsConvertor, customerCardsConvertorFields, 'customer_cards');
	}).then(() => {
		return extract(orders, "customer_id", ordersConvertor, ordersConvertorFields, 'orders');
	}).then(() => {
		return extract(order_items, "order_id", orderItemsConvertor, orderItemsConvertorFields, 'order_items');
	}).then(() => {
		return extract(order_tags, "order_id", orderTagsConvertor, orderTagsConvertorFields, 'order_tags');
	}).then(() => {
		return extract(order_charges, "order_id", orderChargesConvertor, orderChargesConvertorFields, 'order_charges');
	}).then(() => {
		return extract(deliveries, "delivery_time", deliveriesConvertor, deliveriesConvertorFields, 'deliveries');
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

function customerConvertorFields() {
	return [ "original_id", "created_at", "allow_notifications", "formatted_mobile", "mobile", "name", "email", "autocomplete", "street_num", "street_route", "apartment", "city", "state", "zip", "lat", "lng", "delivery_notes", "cleaning_notes", "payment_customer_id", "is_doorman" ];
}

function customerConvertor(customer: Customer) {
		return [
			customer.id,
			new Date(customer._base.core.created_at),
			customer.allow_notifications ? 1 : 0,
			customer.formatted_mobile,
			customer.mobile,
			customer.name,
			customer.email,
			customer.autocomplete,
			customer.street_num,
			customer.street_route,
			customer.apartment,
			customer.city,
			customer.state,
			customer.zip,
			customer.lat,
			customer.lng,
			customer.delivery_notes,
			customer.cleaning_notes,
			customer.payment_customer_id,
			customer.is_doorman ? 1 : 0
		];
}

function customerCardsConvertorFields() {
	return [ "original_id", "created_at", "customer_id", "card_id", "brand", "last4", "exp_month", "exp_year", "is_default", "is_forgotten", "in_stripe", "stripe_token" ]
}

function customerCardsConvertor(card: CustomerCard) {
		return [
			card.id,
			new Date(card._base.core.created_at),
			card.customer_id,
			card.card_id,
			card.brand,
			card.last4,
			card.exp_month,
			card.exp_year,
			card.is_default ? 1 : 0,
			card.is_forgotten ? 1 : 0,
			card.in_stripe ? 1 : 0,
			card.stripe_token
		]
}

function ordersConvertorFields() {
	return [ "original_id", "created_at", "customer_id", "readable_id", "due_datetime", "rack", "notes", "tax", "tip", "discount_percent", "discount_fixed", "balance", "coupon_code", "all_ready", "all_pickedup", "delivery_pickup_id", "delivery_dropoff_id" ]
}

function ordersConvertor(order: Order) {
	return [
		order.id,
		new Date(order._base.core.created_at),
		order.customer_id,
		order.readable_id,
		order.due_datetime ? new Date(order.due_datetime) : null,
		order.rack,
		order.notes,
		order.tax,
		order.tip,
		order.discount_percent,
		order.discount_fixed,
		order.balance,
    order.coupon_code,
		order.all_ready ? 1 : 0,
		order.all_pickedup ? 1 : 0,
		order.delivery_pickup_id,
		order.delivery_dropoff_id
	]
}

function orderItemsConvertorFields() {
	return [ "original_id", "created_at", "order_id", "isbn", "type", "name", "quantity", "price", "notes" ];
}

function orderItemsConvertor(order_item: OrderItem) {
	return [
		order_item.id,
		new Date(order_item._base.core.created_at),
		order_item.order_id,
		order_item.isbn,
		order_item.type,
		order_item.name,
		order_item.quantity,
		order_item.price,
		toString(order_item.notes)
	]
}

function orderTagsConvertorFields() {
	return [ "original_id", "created_at", "order_id", "tag_number", "is_rack" ];
}

function orderTagsConvertor(order_tag: OrderTag) {
	return [
		order_tag.id,
		new Date(order_tag._base.core.created_at),
		order_tag.order_id,
		order_tag.tag_number,
		order_tag.is_rack
	]
}

function orderChargesConvertorFields() {
	return [ "original_id", "created_at", "order_id", "amount", "charge_type", "charge_id", "card_id", "date_cash", "refund_id", "amount_refunded" ];
}

function orderChargesConvertor(order_charge: OrderCharge) {
	return [
		order_charge.id,
		new Date(order_charge._base.core.created_at),
		order_charge.order_id,
		order_charge.amount,
		order_charge.charge_type,
		order_charge.charge_id,
		order_charge.card_id,
		order_charge.date_cash ? new Date(order_charge.date_cash) : null,
		order_charge.refund_id,
		order_charge.amount_refunded
	]
}

function deliveriesConvertorFields() {
	return [ "original_id", "created_at", "customer_id", "is_pickup", "delivery_time", "delivery_person", "is_confirmed", "is_canceled", "express_id" ];
}

function deliveriesConvertor(delivery: Delivery) {
	return [
		delivery.id,
		new Date(delivery._base.core.created_at),
		delivery.customer_id,
		delivery.is_pickup ? 1 : 0,
		new Date(parseInt(delivery.delivery_time)),
		delivery.delivery_person,
		delivery.is_confirmed ? 1 : 0,
		delivery.is_canceled ? 1 : 0,
		delivery.express_id
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