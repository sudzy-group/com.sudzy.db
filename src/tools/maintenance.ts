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
				sync(localTarget, remoteTarget, () => {
					sync(localTarget, remoteTarget, () => {
						sync(localTarget, remoteTarget, () => {
							processExit(0)
						})
					})
				})
			});
		})
	})
})

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
		inserts.push(t.insert(getObjectData(e)));
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

function customerConvertorFields() {
	return [ "original_id", "created_at", "allow_notifications", "formatted_mobile", "mobile", "name", "capital_name", "email", "autocomplete", "street_num", "street_route", "apartment", "city", "state", "zip", "lat", "lng", "delivery_notes", "cleaning_notes", "payment_customer_id", "is_doorman" ];
}

function customerConvertor(customer: Customer) {
		return [
			customer.id,
			customer.created_at,
			customer.allow_notifications ? 1 : 0,
			customer.formatted_mobile,
			customer.mobile,
			customer.name,
			_.toUpper(customer.name),
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
			card.created_at,
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
	return [ "original_id", "created_at", "customer_id", "readable_id", "due_datetime", "rack", "notes", "tax", "tip", "discount_fixed", "discount_id", "balance", "all_ready", "all_pickedup", "delivery_pickup_id", "delivery_dropoff_id" ]
}

function ordersConvertor(order: Order) {
	return [
		order.id,
		order.created_at,
		order.customer_id,
		order.readable_id,
		order.due_datetime,
		order.rack,
		order.notes,
		order.tax,
		order.tip,
		order.discount_fixed,
		order.discount_id,
		order.balance,
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
		order_item.created_at,
		order_item.order_id,
		order_item.isbn,
		order_item.type,
		order_item.name,
		order_item.quantity,
		_.reduce(order_item.extra, (sum, e) => { return sum + (e && e.price ? parseFloat(e.price) : 0)}, order_item.price),
		toString(order_item.notes)
	]
}

function orderTagsConvertorFields() {
	return [ "original_id", "created_at", "order_id", "tag_number", "is_rack" ];
}

function orderTagsConvertor(order_tag: OrderTag) {
	return [
		order_tag.id,
		order_tag.created_at,
		order_tag.order_id,
		order_tag.tag_number,
		order_tag.is_rack
	]
}

function orderChargesConvertorFields() {
	return [ "original_id", "created_at", "order_id", "amount", "charge_type", "charge_id", "card_id", "date_cash", "refund_id", "amount_refunded", "parent_id"];
}

function orderChargesConvertor(order_charge: OrderCharge) {
	return [
		order_charge.id,
		order_charge.created_at,
		order_charge.order_id,
		order_charge.amount,
		order_charge.charge_type,
		order_charge.charge_id,
		order_charge.card_id,
		order_charge.date_cash ? new Date(order_charge.date_cash) : null,
		order_charge.refund_id,
		order_charge.amount_refunded,
		order_charge.parent_id || null
	]
}

function deliveriesConvertorFields() {
	return [ "original_id", "created_at", "customer_id", "is_pickup", "delivery_time", "delivery_person", "is_confirmed", "is_canceled", "is_completed", "express_id", "doorman_first_name", "doorman_last_name", "doorman_signature", "doorman_signed_at", "orders" ];
}

function deliveriesConvertor(delivery: Delivery) {
	return [
		delivery.id,
		delivery.created_at,
		delivery.customer_id,
		delivery.is_pickup ? 1 : 0,
		parseInt(delivery.delivery_time) || 0,
		delivery.delivery_person,
		delivery.is_confirmed ? 1 : 0,
		delivery.is_canceled ? 1 : 0,
		delivery.delivery_notes == "completed" ? 1 : 0,
		delivery.express_id,
		delivery.doorman_first_name, 
		delivery.doorman_last_name, 
		delivery.doorman_signature, 
		delivery.doorman_signed_at, 
		delivery.orders ? delivery.orders.join(',') : null,
	]
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
		parseInt(timesheet.event_time) || 0,
		timesheet.comment
	]
}

function timelinesConvertorFields() {
	return [ "original_id", "created_at", "employee_id", "operation", "order_id", "text" ];
}

function timelinesConvertor(timeline: Timeline) {
	return [
		timeline.id,
		timeline.created_at,
		timeline.employee_id,
		timeline.operation,
		timeline.order_id,
		timeline.text
	]
}

function productsConvertorFields() {
	return [ "original_id", "created_at", "name", "sku", "image", "price", "goods_in_stock" ];
}

function productsConvertor(product: Product) {
	return [
		product.id,
		product.created_at,
		product.name,
		product.sku,
		product.image,
		product.price,
		product.goods_in_stock
	]
}

function purchasesConvertorFields() {
	return [ "original_id", "created_at", "total_price", "payment_type", "payment_id", "refund_id", "number_of_items", 'tax', 'readable_id', 'product_ids'];
}

function purchasesConvertor(purchase: Purchase) {
	return [
		purchase.id,
		purchase.created_at,
		purchase.total_price,
		purchase.payment_type,
		purchase.payment_id,
		purchase.refund_id,
		purchase.product_ids ? purchase.product_ids.length : 0,
		purchase.tax || 0,
		purchase.readable_id || '',
		purchase.product_ids ? purchase.product_ids.join(',') : ''
	]
}

function customerCreditFields() {
	return [ "original_id", "created_at", "customer_id", "original", "balance", "reason", "description", 'employee_id', 'payment_method', 'payment_id'];
}

function customerCreditConvertor(credit: CustomerCredit) {
	return [
		credit.id,
		credit.created_at,
		credit.customer_id,
		credit.original,
		credit.getBalance(),
		credit.reason,
		credit.description,
		credit.employee_id,
		credit.payment_method,
		credit.payment_id
	]
}

function customerCouponFields() {
	return [ "original_id", "created_at", "customer_id", "order_id", "coupon_id"];
}

function customerCouponConvertor(coupon: CustomerCoupon) {
	return [
		coupon.id,
		coupon.created_at,
		coupon.customer_id,
		coupon.order_id,
		coupon.coupon_id
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
