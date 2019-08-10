#!/usr/bin/env node
import * as PouchDB from 'pouchdb';
import * as PouchableAuthentication from 'pouchdb-authentication';
PouchDB.plugin(PouchableAuthentication);

import * as _ from 'lodash';
import Promise from 'ts-promise';
import * as async from 'async';
import * as moment from 'moment';

import { Customers } from "../collections/Customers";
import { CustomerCards } from "../collections/CustomerCards";
import { CustomerCredits } from "../collections/CustomerCredits";
import { Orders } from "../collections/Orders";
import { OrderItems } from "../collections/OrderItems";
import { OrderTags } from "../collections/OrderTags";
import { OrderCharges } from "../collections/OrderCharges";
import { Deliveries } from "../collections/Deliveries";
import { Timesheets } from '../collections/Timesheets';
import { Timelines } from '../collections/Timelines';
import { Purchases } from '../collections/Purchases';
import { Products } from '../collections/Products';

import { Customer } from "../entities/Customer";
import { CustomerCard } from "../entities/CustomerCard";
import { CustomerCredit } from "../entities/CustomerCredit";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { OrderTag } from "../entities/OrderTag";
import { OrderCharge } from "../entities/OrderCharge";
import { Delivery } from "../entities/Delivery";
import { Timesheet } from '../entities/Timesheet';
import { Timeline } from '../entities/Timeline';
import { Purchase } from '../entities/Purchase';
import { Product } from '../entities/Product';

import * as commander from 'commander';
import { CustomerCoupon, CustomerCoupons } from '..';

const SKIP_INTERVAL = 500;

let p = commander
  .version('0.0.1')
  .usage('[options]')
  .option('-p, --remoteHost [value]', 'The remote PouchDB url source')
  .option('-U, --remotePouchDBUser [value]', 'The remote PouchDB user source')
	.option('-P, --remotePouchDBPassword [value]', 'The remote PouchDB password source')
	.option('-o, --storeId [value]', 'The remote store source')
  .option('-j, --remoteHostTarget [value]', 'The remote PouchDB url target')
  .option('-k, --remotePouchDBUserTarget [value]', 'The remote PouchDB user target')
	.option('-l, --remotePouchDBPasswordTarget [value]', 'The remote PouchDB password target')	
	.option('-m, --storeIdTarget [value]', 'The store name target')	
	.parse(process.argv);


if (!p.remoteHost || !p.remoteHostTarget) {
   console.error('no databases arguments given.');
   process.exit(1);
}

var localSource, localTarget;
var remoteSource, remoteTarget;

var customers, customer_cards, customer_coupons, customer_credits, orders, deliveries, order_items, order_tags, order_charges, timesheets, timelines, purchases, products;
var customers_target, customer_cards_target, customer_coupons_target, customer_credits_target, orders_target, deliveries_target, order_items_target, order_tags_target, order_charges_target, timesheets_target, timelines_target, purchases_target, products_target;

var docs = 0;

console.log(p);

connectPouch();
sync(localSource, remoteSource, () => {
	sync(localSource, remoteSource, () => {
		sync(localSource, remoteSource, () => {
			copyPouchToTarget(() => {
				compact(localTarget, () => {
					sync(localTarget, remoteTarget, () => {
						sync(localTarget, remoteTarget, () => {
							sync(localTarget, remoteTarget, () => {
								processExit(0)
							})
						})
					})
				})
			});
		})
	})
})

function compact(db, cb) {
	db.compact().then(cb).catch(cb);
}

function sync(local, remote, cb) {
	let sync = local.sync(remote);
	sync.on('complete', () => { 
		cb && cb();
	}).on('change', info => {
		console.log('Changed ' + _.get(info, 'change.docs_read'));
	}).on('error', () => {
		cb && cb();
	})
}

function connectPouch() {
	localSource = new PouchDB(p.storeId);
	remoteSource = new PouchDB(p.remoteHost + '/' + p.storeId, p.remotePouchDBUser ? {
		auth: {
				username: p.remotePouchDBUser,
				password: p.remotePouchDBPassword
		}
	} : {})

	localTarget = new PouchDB(p.storeIdTarget);
	remoteTarget = new PouchDB(p.remoteHostTarget + '/' + p.storeIdTarget, p.remotePouchDBUserTarget ? {
		auth: {
				username: p.remotePouchDBUserTarget,
				password: p.remotePouchDBPasswordTarget
		}
	} : {})

	customers = new Customers(localSource, Customer);
	customer_cards = new CustomerCards(localSource, CustomerCard);
	customer_credits = new CustomerCredits(localSource, CustomerCredit);
	customer_coupons = new CustomerCoupons(localSource, CustomerCoupon);
	orders = new Orders(localSource, Order);
	deliveries = new Deliveries(localSource, Delivery);
	order_items = new OrderItems(localSource, OrderItem);
	order_tags = new OrderTags(localSource, OrderTag);
	order_charges = new OrderCharges(localSource, OrderCharge);
	timesheets = new Timesheets(localSource, Timesheet);
	timelines = new Timelines(localSource, Timeline);
	products = new Products(localSource, Product);
	purchases = new Purchases(localSource, Purchase);

	customers_target = new Customers(localTarget, Customer);
	customer_cards_target = new CustomerCards(localTarget, CustomerCard);
	customer_credits_target = new CustomerCredits(localTarget, CustomerCredit);
	customer_coupons_target = new CustomerCoupons(localTarget, CustomerCoupon);
	orders_target = new Orders(localTarget, Order);
	deliveries_target = new Deliveries(localTarget, Delivery);
	order_items_target = new OrderItems(localTarget, OrderItem);
	order_tags_target = new OrderTags(localTarget, OrderTag);
	order_charges_target = new OrderCharges(localTarget, OrderCharge);
	timesheets_target = new Timesheets(localTarget, Timesheet);
	products_target = new Products(localTarget, Product);
	purchases_target = new Purchases(localTarget, Purchase);	
}

function copyPouchToTarget(cb) {

	/////////////////////
	// Customers
	/////////////////////
	localSource.info().then(function(info) {
		console.log(info)
		return extract(customers, "mobile", 'customers');
	}).then(() => {
		return extract(customer_cards, "customer_id", 'customer_cards');
	}).then(() => {
		return extract(orders, "customer_id", 'orders');
	}).then(() => {
		return extract(order_items, "order_id", 'order_items');
	}).then(() => {
		return extract(order_tags, "order_id", 'order_tags');
	}).then(() => {
		return extract(order_charges, "order_id", 'order_charges');
	}).then(() => {
		return extract(deliveries, "delivery_time", 'deliveries');
	}).then(() => {
		return extract(timesheets, "event_time", 'timesheets');
	// }).then(() => {
	// 	return extract(timelines, "order_id", 'timelines');
	}).then(() => {
		return extract(products, "sku", 'products');
	}).then(() => {
		return extract(purchases, "payment_id", 'purchases');
	}).then(() => {
		return extract(customer_credits, "customer_id", 'customer_credits');
	}).then(() => {
		return extract(customer_coupons, "customer_id", 'customer_coupons');
	}).then(() => {
		console.log("Disconnecting");
		cb()
	}).catch(m => {
		console.log(m);
		cb(1)
	});
}

function extract(collection, field, keyName, filterFunction?) {
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
						if (filterFunction) {
							result = _.filter(result, filterFunction);
						}
						return insertAll(result, keyName);
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
					console.log(err);
				}
				return resolve(results);
			})

		}).catch(reject);
	});
}

function processExit(status = 0) {
	process.exit(status);
};

function insertAll(es, tableName) {
	console.log("Preparing conversion of " + tableName + ".");
	console.log("Entities to convert: ", es.length);

	if (es.length == 0) {
		return Promise.resolve([]);
	}

	let inserts = [];
	const t = eval(tableName + '_target');
	
	_.each(es, e => {
		inserts.push(t.insert(getObjectData(e), e.created_at, e.id));
	})

	return Promise.all(inserts);
}

function getObjectData(object) {
	let obj = {}
	_.forIn((<any> object).metadata, function(value, key) {
		if (value.mandatory || (object[key] !== null && object[key] !== undefined) ) {
			obj[key] = object[key];
		}
	})
	return obj;
}
