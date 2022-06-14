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
import { Messages } from '../collections/Messages';
import { Labels } from '../collections/Labels';

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
import { Message } from '../entities/Message';
import { Label } from '../entities/Label';

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
	.option('-a, --syncWithTarget [value]', 'need to sync with target remote?')	
	.parse(process.argv);


if (!p.remoteHost || !p.remoteHostTarget) {
   console.error('no databases arguments given.');
   process.exit(1);
}

var localSource, localTarget;
var remoteSource, remoteTarget;

var customers, customer_cards, customer_coupons, customer_credits, orders, deliveries, order_items, order_tags, order_charges, timesheets, timelines, purchases, products, messages, labels;
var customers_target, customer_cards_target, customer_coupons_target, customer_credits_target, orders_target, deliveries_target, order_items_target, order_tags_target, order_charges_target, timesheets_target, timelines_target, purchases_target, products_target, messages_target, labels_target;
const copiedCustomers = [];
const copiedOrders = [];
const pickedupOrder = [];

var docs = 0;

const MONTH = 1000*60*60*24*31;

const MONTH_AGO = Date.now() - MONTH;
const HALF_YEAR_AGO = Date.now() - MONTH * 5;
const YEAR_AGO = Date.now() - MONTH * 8;

connectPouch();
sync(localTarget, remoteTarget, () => {
	sync(localTarget, remoteTarget, () => {
		sync(localTarget, remoteTarget, () => {
			
			processExit(0)
			
		})
	})
})

function compact(db, cb) {
	db.compact().then(cb).catch(cb);
}

function sync(local, remote, cb) {
	console.log('start sync');
	let syncOp = local.sync(remote);
	let inProgress = false
	syncOp.on('complete', () => { 
		cb && cb();
	}).on('paused', info => {
		console.log('paused sync');
		local.info().then(infoLocal => {
			remote.info().then(infoRemote => {
				console.log('infoLocal', infoLocal)
				console.log('infoRemote', infoRemote)
			})
		})		
		cb && cb();
		// if (!inProgress) {
		// }
	}).on('change', info => {		
		inProgress = true
		console.log('Changed ', _.get(info, 'change.docs_read'), progress(info));
	}).on('error', () => {
		console.log('error sync');
		local.info().then(infoLocal => {
			remote.info().then(infoRemote => {
				sync(local, remote, cb);
				console.log('infoLocal', infoLocal)
				console.log('infoRemote', infoRemote)
			})
		})
	})
}

function progress(info) {
	const s = _.get(info, 'change.last_seq');
	return s ? Number(s.substring(0,s.indexOf('-'))) : '';
}

function connectPouch() {
	console.log('*** connectPouch')
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
	messages = new Messages(localSource, Message);
	labels = new Labels(localSource, Label);

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
	messages_target = new Messages(localTarget, Message);
	labels_target = new Labels(localTarget, Label);

}

function copyPouchToTarget(cb) {
	console.log('*** copyPouchToTarget')
	localSource.info().then(function(info) {
		console.log('*** localSource')
		console.log(info)
		return extract(order_items, "order_id", 'order_items', orderItemsFilter);
	}).then(() => {
		return extract(orders, "customer_id", 'orders', ordersFilter, ordersShrink);
	}).then(() => {
		return extract(customers, "mobile", 'customers', customersFilter);
	}).then(() => {
		return extract(customer_cards, "customer_id", 'customer_cards', customerObjectFilter);
	}).then(() => {
		return extract(order_tags, "order_id", 'order_tags', orderTagsFilter);
	}).then(() => {
		return extract(order_charges, "order_id", 'order_charges', orderObjectFilter);
	}).then(() => {
		return extract(deliveries, "delivery_time", 'deliveries', deliveriesFilter);
	}).then(() => {
		return extract(timesheets, "event_time", 'timesheets', timesheetsFilter);
	// }).then(() => {
	// 	return extract(timelines, "order_id", 'timelines');
	}).then(() => {
		return extract(products, "sku", 'products');
	}).then(() => {
		return extract(purchases, "payment_id", 'purchases', purchasesFilter);
	}).then(() => {
		return extract(customer_credits, "customer_id", 'customer_credits', customerObjectFilter);
	}).then(() => {
		return extract(customer_coupons, "customer_id", 'customer_coupons', customerObjectFilter);
	}).then(() => {
		return extract(messages, "group_id", 'messages', messagesFilter);
	}).then(() => {
		return extract(labels, "label", 'labels', labelsFilter);
	}).then(() => {
		console.log("Disconnecting");
		cb()
	}).catch(m => {
		console.log(m);
		cb(1)
	});
}

function extract(collection, field, keyName, filterFunction?, shrinkFunction?) {
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
						return insertAll(result, keyName, shrinkFunction);
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

function insertAll(es, tableName, shrinkFunction?) {
	shrinkFunction = shrinkFunction || _.identity;
	console.log("Preparing conversion of " + tableName + ".");
	console.log("Entities to convert: ", es.length);

	if (es.length == 0) {
		return Promise.resolve([]);
	}

	let inserts = [];
	const t = eval(tableName + '_target');
	
	_.each(es, e => {
		inserts.push(t.insert(shrinkFunction(getObjectData(e), e.created_at), e.created_at, e.id));
	})

	return Promise.all(inserts);
}

function deliveriesFilter(d) {
	return d.created_at > HALF_YEAR_AGO;
}

function ordersFilter(o) {
	if (o.created_at < MONTH_AGO && o.all_pickedup && pickedupOrder.indexOf(o.id) == -1) {
		pickedupOrder.push(o.id)
	}
	if (copiedOrders.indexOf(o.id) == -1) {
		return false;
	}
	const oci = o.customer_id;
	if (copiedCustomers.indexOf(oci) == -1) {
		copiedCustomers.push(oci)
	}
	return true;
}

function ordersShrink(o, created_at) {
	delete o.checkpoint;
	if (created_at < MONTH_AGO) {
		delete o.notes;
		delete o.due_datetime;
		delete o.delivery_pickup_id;
		delete o.delivery_dropoff_id;
		delete o.customer_name;
	}
	if (o.balance === 0) {
		delete o.balance;
	}
	return o;
}

function customersFilter(c) {
	if (copiedCustomers.indexOf(c.id) != -1) {
		return true;
	}
	if (c.created_at > MONTH_AGO) {
		copiedCustomers.push(c.id);
		return true;
	}
	return true;
}

function customerObjectFilter(cc) {
	return copiedCustomers.indexOf(cc.customer_id) != -1;
}

function messagesFilter(m) {
	return m.created_at > MONTH_AGO;
}

function labelsFilter(l) {
	// TODO - no heatseals
	if (l.order_id && l.order_id.substr(0,13) < HALF_YEAR_AGO) {
		return false;
	}
	return false;
}

function timesheetsFilter(t) {
	return t.created_at > HALF_YEAR_AGO;
}

function purchasesFilter(p) {
	return p.created_at > HALF_YEAR_AGO;
}

function orderItemsFilter(oi) {
	if (oi.created_at > YEAR_AGO) {
		if (copiedOrders.indexOf(oi.order_id) == -1) {
			copiedOrders.push(oi.order_id);
		}
		return true;
	}
	return false;
}

function orderObjectFilter(ot) {
	if (copiedOrders.indexOf(ot.order_id) == -1) {
		return false;
	}
	return true;
}

function orderTagsFilter(ot) {
	if (!orderObjectFilter(ot)) {
		return false;
	}

	if (pickedupOrder.indexOf(ot.order_id) != -1) {
		return false;
	}
	return true;
}

function getObjectData(object) {
	let obj = {}
	_.forIn((<any> object).metadata, function(value, key) {
		if (value.mandatory || 
			(object[key] !== null && object[key] !== undefined && 
				!(_.isArray(object[key]) && object[key].length == 0)) && 
				!(_.isString(object[key]) && object[key].length == 0)) {	
			obj[key] = object[key];
		}
	})
	return obj;
}
