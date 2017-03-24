"use strict";
exports.__esModule = true;
var PouchDB = require("pouchdb");
var _ = require("lodash");
var faker = require("faker");
var ts_promise_1 = require("ts-promise");
var express = require("express");
var expressPouchdb = require("express-pouchdb");
var Customers_1 = require("../src/collections/Customers");
var CustomerCards_1 = require("../src/collections/CustomerCards");
var Orders_1 = require("../src/collections/Orders");
var OrderItems_1 = require("../src/collections/OrderItems");
var OrderTags_1 = require("../src/collections/OrderTags");
var OrderCharges_1 = require("../src/collections/OrderCharges");
var Deliveries_1 = require("../src/collections/Deliveries");
var Customer_1 = require("../src/entities/Customer");
var CustomerCard_1 = require("../src/entities/CustomerCard");
var Order_1 = require("../src/entities/Order");
var OrderItem_1 = require("../src/entities/OrderItem");
var OrderTag_1 = require("../src/entities/OrderTag");
var OrderCharge_1 = require("../src/entities/OrderCharge");
var Delivery_1 = require("../src/entities/Delivery");
var config = {
    "port": 5555,
    "pouchURL": "http://localhost:5555/mocks",
    "numMocks": 4
};
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
    customers = new Customers_1.Customers(pouch, Customer_1.Customer);
    customer_cards = new CustomerCards_1.CustomerCards(pouch, CustomerCard_1.CustomerCard);
    orders = new Orders_1.Orders(pouch, Order_1.Order);
    deliveries = new Deliveries_1.Deliveries(pouch, Delivery_1.Delivery);
    order_items = new OrderItems_1.OrderItems(pouch, OrderItem_1.OrderItem);
    order_tags = new OrderTags_1.OrderTags(pouch, OrderTag_1.OrderTag);
    order_charges = new OrderCharges_1.OrderCharges(pouch, OrderCharge_1.OrderCharge);
}
function insertMocks() {
    pouch.info().then(function (info, done) {
        var t = this;
        var ps = [];
        _.times(config.numMocks - 1, function () {
            ps.push(mock());
        });
        ps.push(hardcodedMock());
        ts_promise_1["default"].all(ps).then(function () {
            done();
        })["catch"](_.noop);
    });
}
function deleteMocks(done) {
    console.log("Deleting mocks");
    pouch.destroy(function () { return done(); });
}
//***********
//
//Mocks
function hardcodedMock() {
    var _this = this;
    return new ts_promise_1["default"](function (res, rej) {
        var t = _this;
        var customerObj = {
            mobile: "19173411892",
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
            payment_customer_id: "cus_difif_29392",
            payment_customer_token: "tok_f9f9f_dodod"
        };
        var customerDefaultCardObj = {
            card_id: "card_xkff_fifo",
            brand: "Visa",
            last4: "4242",
            is_default: false
        };
        var customerSecondCardObj = {
            card_id: "card_xg3f_hhh",
            brand: "Visa",
            last4: "0341",
            is_default: true
        };
        var orderObj = {
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
        var deliveryPickupObj = {
            is_pickup: true,
            delivery_time: new Date().getTime(),
            delivery_person: "Candido Bear",
            is_confirmed: true
        };
        var deliveryDropoffObj = {
            is_pickup: false,
            delivery_time: new Date().getTime(),
            express_id: "del_55h_f"
        };
        var orderItem1Obj = {
            item_id: "1234",
            total_price: 20.52,
            name: "Washfold",
            quantity: 3,
            notes: "Clean hard",
            separate: true,
            wash: true,
            detergent: "Tide"
        };
        var orderItem2Obj = {
            item_id: "2a2a",
            total_price: 10.00,
            name: "Pants",
            quantity: 1,
            dry: true,
            color: "blue"
        };
        var orderItem3Obj = {
            item_id: "2b2b",
            total_price: 5.00,
            name: "Skirts",
            quantity: 2,
            dry: true,
            color: "red",
            brand: "Zara",
            pattern: "zebra",
            alteration_type: "Sew zipper"
        };
        var orderTagObj = {
            tag_number: 222
        };
        var orderChargeObj = {
            amount: 120.25,
            charge_id: "ch_4474_h647",
            charge_type: "card"
        };
        //Insert customer
        customers.insert(customerObj).then(function (cust) {
            customerDefaultCardObj["customer_id"] = cust.id;
            customerSecondCardObj["customer_id"] = cust.id;
            orderObj["customer_id"] = cust.id;
            deliveryPickupObj["customer_id"] = cust.id;
            deliveryDropoffObj["customer_id"] = cust.id;
            //Insert default card      
            return customer_cards.insert(customerDefaultCardObj);
        }).then(function (cust_default_card) {
            orderChargeObj["card_id"] = cust_default_card.id;
            //Insert second card       
            return customer_cards.insert(customerSecondCardObj);
        }).then(function (cust_second_card) {
            //Insert delivery pickup      
            return deliveries.insert(deliveryPickupObj);
        }).then(function (delivPickup) {
            //Insert order
            return orders.insert(orderObj);
        }).then(function (ord) {
            orderItem1Obj["order_id"] = ord.id;
            orderItem2Obj["order_id"] = ord.id;
            orderItem3Obj["order_id"] = ord.id;
            orderTagObj["order_id"] = ord.id;
            orderChargeObj["order_id"] = ord.id;
            //Insert order item 1      
            return order_items.insert(orderItem1Obj);
        }).then(function (ord_item_1) {
            //Insert order item 2
            return order_items.insert(orderItem2Obj);
        }).then(function (ord_item_2) {
            //Insert order item 3
            return order_items.insert(orderItem3Obj);
        }).then(function (ord_item_3) {
            //Insert 3 order tags      
            return order_tags.insert(orderTagObj);
        }).then(function (ord_tag1) {
            return order_tags.insert(orderTagObj);
        }).then(function (ord_tag2) {
            return order_tags.insert(orderTagObj);
        }).then(function (ord_tag3) {
            //Insert order charge
            return order_charges.insert(orderChargeObj);
        }).then(function (ord_charge) {
            //Insert delivery dropoff      
            return deliveries.insert(deliveryDropoffObj);
        }).then(function (delivDropoff) {
            return res(true);
        })["catch"](function (m) {
            console.log(m);
            console.log("Error in testWorkflow");
            return rej(new Error("Error"));
        });
    });
}
function mock() {
    var _this = this;
    return new ts_promise_1["default"](function (res, rej) {
        var t = _this;
        var customerObj = {
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
            payment_customer_id: "cus_" + faker.random.uuid(),
            payment_customer_token: "tok_" + faker.random.uuid()
        };
        var customerDefaultCardObj = {
            card_id: "card_" + faker.random.uuid(),
            brand: "Visa",
            last4: "4242",
            is_default: true
        };
        var customerSecondCardObj = {
            card_id: "card_" + faker.random.uuid(),
            brand: "Visa",
            last4: "0341",
            is_default: false
        };
        var orderObj = {
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
        var deliveryPickupObj = {
            is_pickup: true,
            delivery_time: new Date().getTime(),
            delivery_person: faker.name.findName(),
            is_confirmed: true
        };
        var deliveryDropoffObj = {
            is_pickup: false,
            delivery_time: new Date().getTime(),
            express_id: "del_" + faker.random.uuid()
        };
        var orderItem1Obj = {
            item_id: "1234",
            total_price: faker.commerce.price(),
            name: "Washfold",
            quantity: faker.random.number(),
            notes: "Clean hard",
            separate: true,
            wash: true,
            detergent: "Tide"
        };
        var orderItem2Obj = {
            item_id: "2a2a",
            total_price: faker.commerce.price(),
            name: "Pants",
            quantity: faker.random.number(),
            dry: true,
            color: faker.commerce.color()
        };
        var orderItem3Obj = {
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
        var orderTagObj = {
            tag_number: faker.random.number()
        };
        var orderChargeObj = {
            amount: faker.commerce.price(),
            charge_id: "ch_" + faker.random.uuid(),
            charge_type: "card"
        };
        var orderChargeCashObj = {
            amount: faker.commerce.price(),
            charge_id: "ch_" + faker.random.uuid(),
            charge_type: "cash",
            date_cash: new Date().getTime()
        };
        //Insert customer
        customers.insert(customerObj).then(function (cust) {
            customerDefaultCardObj["customer_id"] = cust.id;
            customerSecondCardObj["customer_id"] = cust.id;
            orderObj["customer_id"] = cust.id;
            deliveryPickupObj["customer_id"] = cust.id;
            deliveryDropoffObj["customer_id"] = cust.id;
            //Insert default card      
            return customer_cards.insert(customerDefaultCardObj);
        }).then(function (cust_default_card) {
            orderChargeObj["card_id"] = cust_default_card.id;
            orderChargeCashObj["card_id"] = cust_default_card.id;
            //Insert second card       
            return customer_cards.insert(customerSecondCardObj);
        }).then(function (cust_second_card) {
            //Insert delivery pickup      
            return deliveries.insert(deliveryPickupObj);
        }).then(function (delivPickup) {
            //Insert order
            return orders.insert(orderObj);
        }).then(function (ord) {
            orderItem1Obj["order_id"] = ord.id;
            orderItem2Obj["order_id"] = ord.id;
            orderItem3Obj["order_id"] = ord.id;
            orderTagObj["order_id"] = ord.id;
            orderChargeObj["order_id"] = ord.id;
            orderChargeCashObj["order_id"] = ord.id;
            //Insert order item 1      
            return order_items.insert(orderItem1Obj);
        }).then(function (ord_item_1) {
            //Insert order item 2
            return order_items.insert(orderItem2Obj);
        }).then(function (ord_item_2) {
            //Insert order item 3
            return order_items.insert(orderItem3Obj);
        }).then(function (ord_item_3) {
            //Insert 3 order tags      
            return order_tags.insert(orderTagObj);
        }).then(function (ord_tag1) {
            return order_tags.insert(orderTagObj);
        }).then(function (ord_tag2) {
            return order_tags.insert(orderTagObj);
        }).then(function (ord_tag3) {
            //Insert order charge
            return order_charges.insert(orderChargeObj);
        }).then(function (ord_charge) {
            //Insert cash charge
            return order_charges.insert(orderChargeCashObj);
        }).then(function (ord_charge2) {
            return deliveries.insert(deliveryDropoffObj);
        }).then(function (delivDropoff) {
            console.log("Finished inserting mocks");
            return res(true);
        })["catch"](function (m) {
            console.log(m);
            console.log("Error in mock");
            return rej(new Error("Error"));
        });
    });
}
