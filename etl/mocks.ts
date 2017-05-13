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
	"pouchURL": "http://localhost:5555/mocks",
	"numMocks": 4
}

var app;
var pouch;
var customers, customer_cards, orders, deliveries, order_items, order_tags, order_charges;

connectPouch();
insertMocks();
//deleteMocks();

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


function insertMocks() {
	pouch.info().then(function(info, done) {
		let t = this;
		let ps = [];

		_.times(config.numMocks - 1, function() {
			ps.push(mock());
		})
		ps.push(hardcodedMock());
	
		Promise.all(ps).then(() => {
			done();
		}).catch(_.noop);
	});
}


function deleteMocks(done: Function) {
	console.log("Deleting mocks");
	pouch.destroy(() => done());
}



//***********
//
//Mocks
function hardcodedMock() {
	return new Promise((res, rej) => {
		let t = this;
		let customerObj = {
			id: "123",
			created_at: "1234",
			mobile: "19173411892",
			allow_notifications: true,
			formatted_mobile: "19173411892",
			name: "Jay Shmoe",
			email: "hbarr@gmail.com",
			autocomplete: "199 Orchard St, New York, NY 10002, USA",
			street_num: "199",
			street_route: "Orchard Street",
			apartment: "2D",
			city: "New York",
			state: "NY",
			zip: "10002",
			lat: "40.72224",
			lng: "-73.988152",
			delivery_notes: "Ring bell twice",
			cleaning_notes: "Clean slowly",
			payment_customer_id: "cus_difif_29392"
		};
		let customerDefaultCardObj = {
			card_id: "card_xkff_fifo",
			brand: "Visa",
			last4: "4242",
			exp_month: "12",
			exp_year: "19",
			is_default: false,
			is_forgotten: false,
			in_stripe: false,
			stripe_token: ""
		};

		let customerSecondCardObj = {
			card_id: "card_xg3f_hhh",
			brand: "Visa",
			last4: "0341",
			exp_month: "1",
			exp_year: "22",
			is_default: true,
			is_forgotten: false,
			in_stripe: true,
			stripe_token: "tok_sos_g9339"
		};

		let orderObj = {
			readable_id: "abc123",
			due_datetime: new Date().getTime(),
			rack: "222",
			notes: "Please do quickly",
			tax: 1.95,
			tip: 2.00,
			discount_fixed: 5.00,
			balance: 100.00,
			all_ready: true,
			all_pickedup: true,
			delivery_pickup_id: "del_hff_6546",
			delivery_dropoff_id: "del_gee_86"
		};

		let deliveryPickupObj = {
			is_pickup: true,
			delivery_time: new Date().getTime(),
			delivery_person: "Candido Bear",
			is_confirmed: true
		}

		let deliveryDropoffObj = {
			is_pickup: false,
			delivery_time: new Date().getTime(),
			express_id: "del_55h_f"
		}

		let orderItem1Obj = {
			isbn: "1234",
			price: 20.52,
			type: 'wf',
			name: "Washfold",
			quantity: 3,
			separate: true,
			detergent: "Tide"
		};

		let orderItem2Obj = {
			isbn: "2a2a",
			price: 10.00,
			type: 'dc',
			name: "Pants",
			quantity: 1,
			color: "blue"
		};

		let orderItem3Obj = {
			isbn: "2b2b",
			total_price: 5.00,
			type: 'dc',
			name: "Skirts",
			price: 2,
			color: "red",
			brand: "Zara",
			pattern: "zebra",
		};

		let orderTagObj = {
			tag_number: 222
		};

		let orderChargeObj = {
			amount: 120.25,
			charge_id: "ch_4474_h647",
			charge_type: "card"
		};

		//Insert customer
		customers.insert(customerObj).then((cust) => {
			customerDefaultCardObj["customer_id"] = cust.id;
			customerSecondCardObj["customer_id"] = cust.id;
			orderObj["customer_id"] = cust.id;
			deliveryPickupObj["customer_id"] = cust.id;
			deliveryDropoffObj["customer_id"] = cust.id;
			//Insert default card      
			return customer_cards.insert(customerDefaultCardObj);
		}).then((cust_default_card) => {
			orderChargeObj["card_id"] = cust_default_card.id;
			//Insert second card       
			return customer_cards.insert(customerSecondCardObj);
		}).then((cust_second_card) => {
			//Insert delivery pickup      
			return deliveries.insert(deliveryPickupObj);
		}).then((delivPickup) => {
			//Insert order
			return orders.insert(orderObj);
		}).then((ord) => {
			orderItem1Obj["order_id"] = ord.id;
			orderItem2Obj["order_id"] = ord.id;
			orderItem3Obj["order_id"] = ord.id;
			orderTagObj["order_id"] = ord.id;
			orderChargeObj["order_id"] = ord.id;
			//Insert order item 1      
			return order_items.insert(orderItem1Obj);
		}).then((ord_item_1) => {
			//Insert order item 2
			return order_items.insert(orderItem2Obj);
		}).then((ord_item_2) => {
			//Insert order item 3
			return order_items.insert(orderItem3Obj);
		}).then((ord_item_3) => {
			//Insert 3 order tags      
			return order_tags.insert(orderTagObj);
		}).then((ord_tag1) => {
			return order_tags.insert(orderTagObj);
		}).then((ord_tag2) => {
			return order_tags.insert(orderTagObj);
		}).then((ord_tag3) => {
			//Insert order charge
			return order_charges.insert(orderChargeObj);
		}).then((ord_charge) => {
			//Insert delivery dropoff      
			return deliveries.insert(deliveryDropoffObj);
		}).then((delivDropoff) => {
			return res(true);
		}).catch(function(m) {
			console.log(m);
			console.log("Error in testWorkflow");
			return rej(new Error("Error"));
		});
	});
}



function mock() {
	return new Promise((res, rej) => {
		let t = this;

		let customerObj = {
			mobile: (Math.floor(Math.random() * 9000000000) + 1000000000).toString(),
			name: faker.name.findName(),
			email: faker.internet.email(),
			autocomplete: "199 Orchard St, New York, NY 10002, USA",
			street_num: faker.random.number(),
			street_route: faker.address.streetName(),
			apartment: faker.random.number(),
			city: faker.address.city(),
			state: "NY",
			zip: faker.address.zipCode(),
			lat: "40.72224",
			lng: "-73.988152",
			delivery_notes: "Ring bell twice",
			cleaning_notes: "Clean slowly",
			payment_customer_id: "cus_" + faker.random.uuid()
		};

		let customerDefaultCardObj = {
			card_id: "card_" + faker.random.uuid(),
			brand: "Visa",
			last4: "4242",
			is_default: true
		};

		let customerSecondCardObj = {
			card_id: "card_" + faker.random.uuid(),
			brand: "Visa",
			last4: "0341",
			is_default: false
		};

		let orderObj = {
			readable_id: faker.random.uuid(),
			due_datetime: new Date().getTime(),
			rack: "222",
			notes: "Please do quickly",
			tax: faker.commerce.price(),
			tip: faker.commerce.price(),
			discount_fixed: 5.00,
			balance: faker.commerce.price(),
			all_ready: true,
			all_pickedup: true,
			delivery_pickup_id: "del_" + faker.random.uuid(),
			delivery_dropoff_id: "del_" + faker.random.uuid()
		};

		let deliveryPickupObj = {
			is_pickup: true,
			delivery_time: new Date().getTime(),
			delivery_person: faker.name.findName(),
			is_confirmed: true
		}

		let deliveryDropoffObj = {
			is_pickup: false,
			delivery_time: new Date().getTime(),
			express_id: "del_" + faker.random.uuid()
		}

		let orderItem1Obj = {
			item_id: "1234",
			total_price: faker.commerce.price(),
			name: "Washfold",
			quantity: faker.random.number(),
			notes: "Clean hard",
			separate: true,
			wash: true,
			detergent: "Tide"
		};

		let orderItem2Obj = {
			item_id: "2a2a",
			total_price: faker.commerce.price(),
			name: "Pants",
			quantity: faker.random.number(),
			dry: true,
			color: faker.commerce.color()
		};

		let orderItem3Obj = {
			item_id: "2b2b",
			total_price: faker.commerce.price(),
			name: "Skirts",
			quantity: faker.random.number(),
			dry: true,
			color: faker.commerce.color(),
			brand: "Zara",
			pattern: "zebra",
			alteration_type: "Sew zipper"
		};

		let orderTagObj = {
			tag_number: faker.random.number()
		};

		let orderChargeObj = {
			amount: faker.commerce.price(),
			charge_id: "ch_" + faker.random.uuid(),
			charge_type: "card"
		};

		let orderChargeCashObj = {
			amount: faker.commerce.price(),
			charge_id: "ch_" + faker.random.uuid(),
			charge_type: "cash",
			date_cash: new Date().getTime()
		}

		//Insert customer
		customers.insert(customerObj).then((cust) => {
			customerDefaultCardObj["customer_id"] = cust.id;
			customerSecondCardObj["customer_id"] = cust.id;
			orderObj["customer_id"] = cust.id;
			deliveryPickupObj["customer_id"] = cust.id;
			deliveryDropoffObj["customer_id"] = cust.id;
			//Insert default card      
			return customer_cards.insert(customerDefaultCardObj);
		}).then((cust_default_card) => {
			orderChargeObj["card_id"] = cust_default_card.id;
			orderChargeCashObj["card_id"] = cust_default_card.id;
			//Insert second card       
			return customer_cards.insert(customerSecondCardObj);
		}).then((cust_second_card) => {
			//Insert delivery pickup      
			return deliveries.insert(deliveryPickupObj);
		}).then((delivPickup) => {
			//Insert order
			return orders.insert(orderObj);
		}).then((ord) => {
			orderItem1Obj["order_id"] = ord.id;
			orderItem2Obj["order_id"] = ord.id;
			orderItem3Obj["order_id"] = ord.id;
			orderTagObj["order_id"] = ord.id;
			orderChargeObj["order_id"] = ord.id;
			orderChargeCashObj["order_id"] = ord.id;
			//Insert order item 1      
			return order_items.insert(orderItem1Obj);
		}).then((ord_item_1) => {
			//Insert order item 2
			return order_items.insert(orderItem2Obj);
		}).then((ord_item_2) => {
			//Insert order item 3
			return order_items.insert(orderItem3Obj);
		}).then((ord_item_3) => {
			//Insert 3 order tags      
			return order_tags.insert(orderTagObj);
		}).then((ord_tag1) => {
			return order_tags.insert(orderTagObj);
		}).then((ord_tag2) => {
			return order_tags.insert(orderTagObj);
		}).then((ord_tag3) => {
			//Insert order charge
			return order_charges.insert(orderChargeObj);
		}).then((ord_charge) => {
			//Insert cash charge
			return order_charges.insert(orderChargeCashObj);
		}).then((ord_charge2) => {
			return deliveries.insert(deliveryDropoffObj);
		}).then((delivDropoff) => {
			console.log("Finished inserting mocks");
			return res(true);
		}).catch(function(m) {
			console.log(m);
			console.log("Error in mock");
			return rej(new Error("Error"));
		});
	});
}


