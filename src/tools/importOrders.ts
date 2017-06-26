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

let p = commander
  .version('0.0.1')
  .usage('[options]')
  .option('-p, --remotePouchDB [value]', 'The remote PouchDB url')
  .option('-U, --remotePouchDBUser [value]', 'The remote PouchDB user')
  .option('-P, --remotePouchDBPassword [value]', 'The remote PouchDB password')
	.option('-s, --storeId [value]', 'The store user')
	.option('-f, --ordersFile [value]', 'The orders csv file')
	.option('-F, --orderItemsFile [value]', 'The item orders csv file')	
	.parse(process.argv);

if (!p.remotePouchDB || !p.storeId) {
   console.error('no databases arguments given.');
   process.exit(1);
}

var pouch, orders: Orders, orderItems: OrderItems, orderCharges: OrderCharges;
let database: Database = new Database('default');

let loadedOrders, loadedOrderItems; 

connectPouch( () => {
	loadOrders(os => {
		loadedOrders = os;
		loadOrderItems(ois => {
			loadedOrderItems = _.groupBy(ois, 'order_id');
		
			let ps = [];
			loadedOrders.forEach(o => {
				o.created_at = new Date(o.created_at).getTime();
				let order = {
					customer_id: o.customer_id,
					readable_id: o.readable_id,
					balance: 0,
					all_pickedup: true
				}
				ps.push(orders.insert(order, o.created_at)) ;
			});
			Promise.all(ps).then(oss => {
				let ps = [];
				oss.forEach(o => {
					let order_id = o.id;
					let created_at = o.created_at;
					let readable_id = o.readable_id;
					let items = loadedOrderItems[readable_id];
					let total = 0;
					if (!items) {
						console.log("no items");
						return;
					}
					items.forEach(i => {
						total += parseFloat(i.price);
						let item = {
							order_id: order_id,
							isbn: i.isbn,
							type: i.type,
							name: i.name,
							quantity: parseInt(i.quantity),
							price: parseFloat(i.price),
							is_manual_pricing: true
						}
						ps.push(orderItems.insert(item)) ;
					});
					let charge = {
						order_id: order_id,
						amount: total,
						charge_type: 'cash'
					}
					ps.push(orderCharges.insert(charge, created_at))
				});
				Promise.all(ps).then(() => {
					database.sync().on('complete', () => {
						console.log('sync done');
					}).on('error', m => console.log(m));
				})
			}).catch(m=>console.log(m))
		});
	});
});


		
function connectPouch(callback) {
	database.localStatus().then((m) => {
		console.log(m);
	});

	console.log("remote pouch db", p.remotePouchDB);
	database.connect(p.remotePouchDB, p.storeId, p.remotePouchDBUser, p.remotePouchDBPassword).then(() => {
		console.log("start syncing");
		database.sync().on('change', (m) => console.log(m)).on('complete', () => {
			console.log("synced");
			orders = new Orders(database.db, Order);
			orderItems = new OrderItems(database.db, OrderItem);
			orderCharges = new OrderCharges(database.db, OrderCharge);

			callback();
		}).on('error', m => console.log(m));
	}).catch(m => console.log(m));
}

function loadOrders(callback) {
	let orders = [];
	csv()
	.fromFile(p.ordersFile)
	.on('json',(jsonObj)=>{
		orders.push(jsonObj);
	})
	.on('done',(error)=>{
		callback(orders);
	})
}

function loadOrderItems(callback) {
	let orderItems = [];
	csv()
	.fromFile(p.orderItemsFile)
	.on('json',(jsonObj)=>{
		orderItems.push(jsonObj);
	})
	.on('done',(error)=>{
		callback(orderItems);
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
