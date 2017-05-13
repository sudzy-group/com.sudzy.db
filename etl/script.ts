import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as faker from 'faker';
import Promise from "ts-promise";
import * as express from "express";
import * as expressPouchdb from "express-pouchdb";
import * as mysql from "mysql";

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

var config = {
	"port": 5555,
	"pouchURL": "http://localhost:5555/mocks"
}

var app;
var pouch;
var customers, customer_cards, orders, deliveries, order_items, order_tags, order_charges;
var SQLconnection;

connectPouch();
connectSQL();
copyPouchToSQL();


function connectPouch() {
	app = express();
	app.use('/', expressPouchdb(PouchDB));
	app.listen(config.port);
	pouch = new PouchDB(config.pouchURL);

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
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'pouch',
		multipleStatements: true
	});

	SQLconnection.connect(function(err) {
		if (err) {
			console.error('error connecting to mysql: ' + err.stack);
			return;
		}
		console.log('connected to mysql');
		SQLconnection.query('DELETE FROM etl_customers; DELETE FROM etl_customer_cards; DELETE FROM etl_orders; DELETE FROM etl_order_items; DELETE FROM etl_order_tags; DELETE FROM etl_order_charges; DELETE FROM etl_deliveries;'
			, function(error, results, fields) {
				if (error) throw error;
			});
	});
}


function copyPouchToSQL() {
	pouch.info().then(function(info) {
		return customers.find("name", "", { startsWith: true });
	}).then((cs) => {
		//1. Copy customers from pouch to sql
		if (cs.length > 0) {
			_.each(cs, function(customer) {
				let cus = {
					id: customer.id,
					created_at: customer.created_at,
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

				var query = SQLconnection.query('INSERT INTO etl_customers SET ?', cus, function(error, results, fields) {
					if (error) throw error;
				});
			});
		}
		return customer_cards.find("customer_id", "", { startsWith: true });
	}).then((crds) => {
		//2. Copy customer cards from pouch to sql 
		if (crds.length > 0) {
			_.each(crds, function(card) {
				let crd = {
					id: card.id,
					created_at: card.created_at,
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

				var query = SQLconnection.query('INSERT INTO etl_customer_cards SET ?', crd, function(error, results, fields) {
					if (error) throw error;
				});
			});
		}
		return orders.find("customer_id", "", { startsWith: true });
	}).then((ords) => {
		//3. Copy orders from pouch to sql	   
		if (ords.length > 0) {
			_.each(ords, function(order) {
				let ord = {
					id: order.id,
					created_at: order.created_at,
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
					all_ready: order.all_ready ? 1 : 0,
					all_pickedup: order.all_pickedup ? 1 : 0,
					delivery_pickup_id: order.delivery_pickup_id,
					delivery_dropoff_id: order.delivery_dropoff_id
				}

				var query = SQLconnection.query('INSERT INTO etl_orders SET ?', ord, function(error, results, fields) {
					if (error) throw error;
				});
			});
		}
		return order_items.find("order_id", "", { startsWith: true });
	}).then((ord_items) => {
		//4. Copy order items from pouch to sql	
		if (ord_items.length > 0) {
			_.each(ord_items, function(order_item) {
				let ord_item = {
					id: order_item.id,
					created_at: order_item.created_at,
					order_id: order_item.order_id,
					isbn: order_item.isbn,
					type: order_item.type,
					name: order_item.name,
					quantity: order_item.quantity,
					price: order_item.price,
					separate: order_item.separate ? 1 : 0,
					detergent: order_item.detergent,
					preferred_wash: order_item.preferred_wash,
					preferred_dry: order_item.preferred_dry,
					color: order_item.color,
					pattern: order_item.pattern,
					brand: order_item.brand,
					fabric: order_item.fabric
				}
				var query = SQLconnection.query('INSERT INTO etl_order_items SET ?', ord_item, function(error, results, fields) {
					if (error) throw error;
				});
			});
		}
		return order_tags.find("order_id", "", { startsWith: true });
	}).then((ord_tags) => {
		//5. Copy order tagss from pouch to sql	
		if (ord_tags.length > 0) {
			_.each(ord_tags, function(order_tag) {
				let ord_tag = {
					id: order_tag.id,
					order_id: order_tag.order_id,
					tag_number: order_tag.tag_number
				}
				var query = SQLconnection.query('INSERT INTO etl_order_tags SET ?', ord_tag, function(error, results, fields) {
					if (error) throw error;
				});
			});
		}
		return order_charges.find("order_id", "", { startsWith: true });
	}).then((ord_charges) => {
		//6. Copy order charges from pouch to sql	
		if (ord_charges.length > 0) {
			_.each(ord_charges, function(order_charge) {
				let ord_charge = {
					id: order_charge.id,
					created_at: order_charge.created_at,
					order_id: order_charge.order_id,
					amount: order_charge.amount,
					charge_type: order_charge.charge_type,
					charge_id: order_charge.charge_id,
					card_id: order_charge.card_id,
					date_cash: order_charge.date_cash ? new Date(order_charge.date_cash) : null,
					refund_id: order_charge.refund_id,
					amount_refunded: order_charge.amount_refunded
				}
				var query = SQLconnection.query('INSERT INTO etl_order_charges SET ?', ord_charge, function(error, results, fields) {
					if (error) throw error;
				});
			});
		}
		return deliveries.find("delivery_time", "", { startsWith: true });
	}).then((delivs) => {
		//7. Copy deliveries from pouch to sql	
		if (delivs.length > 0) {
			let amount = delivs.length;
			let i = 0;
			_.each(delivs, function(delivery) {
				let deliv = {
					id: delivery.id,
					created_at: delivery.created_at,
					customer_id: delivery.customer_id,
					is_pickup: delivery.is_pickup ? 1 : 0,
					delivery_time: new Date(delivery.delivery_time),
					delivery_person: delivery.delivery_person,
					is_confirmed: delivery.is_confirmed ? 1 : 0,
					is_canceled: delivery.is_canceled ? 1 : 0,
					express_id: delivery.express_id
				}
				var query = SQLconnection.query('INSERT INTO etl_deliveries SET ?', deliv, function(error, results, fields) {
					if (error) throw error;
					i++;
					if (i == amount) {
						console.log("About to disconnect");
						disconnectSQL();
					}
				});
			});
		} else {
			console.log("About to disconnect");
			disconnectSQL();
		}
	}).catch(_.noop);
};



function disconnectSQL() {
	SQLconnection.destroy();
};

