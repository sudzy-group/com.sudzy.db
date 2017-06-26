#!/usr/bin/env node
import * as PouchDB from "pouchdb";
import * as PouchableAuthentication from 'pouchdb-authentication';
PouchDB.plugin(PouchableAuthentication);

import * as _ from 'lodash';
import * as mysql from 'mysql';
import Promise from 'ts-promise';
import * as async from "async";

import { Customers } from "../src/collections/Customers";
import { CustomerCards } from "../src/collections/CustomerCards";
import { Orders } from "../src/collections/Orders";
import { OrderItems } from "../src/collections/OrderItems";
import { OrderTags } from "../src/collections/OrderTags";
import { OrderCharges } from "../src/collections/OrderCharges";
import { Deliveries } from "../src/collections/Deliveries";

import { Customer } from "../src/entities/Customer";
import { CustomerCard } from "../src/entities/CustomerCard";
import { Order } from "../src/entities/Order";
import { OrderItem } from "../src/entities/OrderItem";
import { OrderTag } from "../src/entities/OrderTag";
import { OrderCharge } from "../src/entities/OrderCharge";
import { Delivery } from "../src/entities/Delivery";
import { Database } from '../src/access/Database';
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
		return extract(customers, "mobile", customerConvertor, 'customers', 1000);
	}).then(() => {
		return extract(customer_cards, "customer_id", customerCardsConvertor, 'customer_cards', 1000);
	}).then(() => {
		return extract(orders, "customer_id", ordersConvertor, 'orders', 1000);
	}).then(() => {
		return extract(order_items, "order_id", orderItemsConvertor, 'order_items', 2000);
	}).then(() => {
		return extract(order_tags, "order_id", orderTagsConvertor, 'order_tags', 2000);
	}).then(() => {
		return extract(order_charges, "order_id", orderChargesConvertor, 'order_charges', 1000);
	}).then(() => {
		return extract(deliveries, "delivery_time", deliveriesConvertor, 'deliveries', 500);
	}).then(() => {
		console.log("Disconnecting");
		disconnectSQL();
	}).catch(m => {
		console.log(m);
		disconnectSQL(1);
	});

}		

function extract(collection, field, convertor, keyName, limit) {
	console.log('extracting ' + keyName);
	return new Promise((resolve, reject) => {
		collection.findIds(field, "", { startsWith: true }).then(ids => {
			let l = ids.length;
			console.log('total to convert' , l, keyName);
			let skip = 0;
			let ps = [];
			while (l > 0 && skip < limit) {
				let find = _.partialRight((callback, skip) => {
					collection.find(field, "", { startsWith: true, skip: skip, limit: SKIP_INTERVAL }).then((result) => {
						console.log('converting...', result.length);
						let ps = getPromises(result, convertor, keyName);
						return Promise.all(ps);
					}).then((r) => {
						callback(null, r.length);
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

function insert(table, data) {
	return new Promise((resolve, reject) => {
		SQLconnection.query('INSERT INTO ' + p.storeId + '_' + table +' SET ?', data, function(error, results, fields) {
			resolve(results);
		});
	})
}

function getPromises(es, convertor, tableName) {
	console.log("Preparing conversion of " + tableName + ".");
	console.log("Entities to convert: ", es.length);

	let ps = [];
	_.each(es, e => {
		ps.push(insert(tableName, convertor(e)));
	})
	return ps;
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

function customerCardsConvertor(card: CustomerCard) {
		return {
			original_id: card.id,
			created_at: new Date(card._base.core.created_at),
			customer_id: card.customer_id,
			card_id: card.card_id,
			brand: card.brand,
			last4: card.last4,
			exp_month: card.exp_month,
			exp_year: card.exp_year,
			is_default: card.is_default ? 1 : 0,
			is_forgotten: card.is_forgotten ? 1 : 0,
			in_stripe: card.in_stripe ? 1 : 0,
			stripe_token: card.stripe_token
		}
}

function ordersConvertor(order: Order) {
	return {
		original_id: order.id,
		created_at: new Date(order._base.core.created_at),
		customer_id: order.customer_id,
		readable_id: order.readable_id,
		due_datetime: order.due_datetime ? new Date(order.due_datetime) : null,
		rack: order.rack,
		notes: order.notes,
		tax: order.tax,
		tip: order.tip,
		discount_percent: order.discount_percent,
		discount_fixed: order.discount_fixed,
		balance: order.balance,
    coupon_code: order.coupon_code,
		all_ready: order.all_ready ? 1 : 0,
		all_pickedup: order.all_pickedup ? 1 : 0,
		delivery_pickup_id: order.delivery_pickup_id,
		delivery_dropoff_id: order.delivery_dropoff_id
	}
}

function orderItemsConvertor(order_item: OrderItem) {
	return {
		original_id: order_item.id,
		created_at: new Date(order_item._base.core.created_at),
		order_id: order_item.order_id,
		isbn: order_item.isbn,
		type: order_item.type,
		name: order_item.name,
		quantity: order_item.quantity,
		price: order_item.price,
		notes: toString(order_item.notes)
	}
}

function orderTagsConvertor(order_tag: OrderTag) {
	return {
		original_id: order_tag.id,
		created_at: new Date(order_tag._base.core.created_at),
		order_id: order_tag.order_id,
		tag_number: order_tag.tag_number,
		is_rack: order_tag.is_rack
	}
}

function orderChargesConvertor(order_charge: OrderCharge) {
	return {
		original_id: order_charge.id,
		created_at: new Date(order_charge._base.core.created_at),
		order_id: order_charge.order_id,
		amount: order_charge.amount,
		charge_type: order_charge.charge_type,
		charge_id: order_charge.charge_id,
		card_id: order_charge.card_id,
		date_cash: order_charge.date_cash ? new Date(order_charge.date_cash) : null,
		refund_id: order_charge.refund_id,
		amount_refunded: order_charge.amount_refunded
	}
}

function deliveriesConvertor(delivery: Delivery) {
	return {
		original_id: delivery.id,
		created_at: new Date(delivery._base.core.created_at),
		customer_id: delivery.customer_id,
		is_pickup: delivery.is_pickup ? 1 : 0,
		delivery_time: new Date(delivery.delivery_time),
		delivery_person: delivery.delivery_person,
		is_confirmed: delivery.is_confirmed ? 1 : 0,
		is_canceled: delivery.is_canceled ? 1 : 0,
		express_id: delivery.express_id
	}
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
