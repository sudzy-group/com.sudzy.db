"use strict";
exports.__esModule = true;
var PouchDB = require("pouchdb");
var _ = require("lodash");
var faker = require("faker");
var ts_promise_1 = require("ts-promise");
var express = require("express");
var expressPouchdb = require("express-pouchdb");
var mysql = require("mysql");
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
var app = express();
app.use('/', expressPouchdb(PouchDB));
app.listen(5555);
var db = new PouchDB("http://localhost:5555/mocks");
db.customers = new Customers_1.Customers(db, Customer_1.Customer);
db.customer_cards = new CustomerCards_1.CustomerCards(db, CustomerCard_1.CustomerCard);
db.orders = new Orders_1.Orders(db, Order_1.Order);
db.deliveries = new Deliveries_1.Deliveries(db, Delivery_1.Delivery);
db.order_items = new OrderItems_1.OrderItems(db, OrderItem_1.OrderItem);
db.order_tags = new OrderTags_1.OrderTags(db, OrderTag_1.OrderTag);
db.order_charges = new OrderCharges_1.OrderCharges(db, OrderCharge_1.OrderCharge);
var customers = db.customers;
var customer_cards = db.customer_cards;
var orders = db.orders;
var deliveries = db.deliveries;
var order_items = db.order_items;
var order_tags = db.order_tags;
var order_charges = db.order_charges;
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pouch',
    multipleStatements: true
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting to mysql: ' + err.stack);
        return;
    }
    console.log('connected to mysql');
    connection.query('DELETE FROM etl_customers; DELETE FROM etl_customer_cards;', function (error, results, fields) {
        if (error)
            throw error;
    });
});
function hardcodedMock() {
    var _this = this;
    return new ts_promise_1["default"](function (res, rej) {
        var t = _this;
        var customerObj = {
            mobile: "19173411892",
            name: "Joe Shmoe",
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
            is_default: true
        };
        var customerSecondCardObj = {
            card_id: "card_xg3f_hhh",
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
            item_id: "2a2a",
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
            charge_id: "ch_" + faker.random.uuid()
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
function disconnect(done) {
    connection.destroy();
    db.destroy(function () { return done(); });
}
db.info().then(function (info, done) {
    var t = this;
    //About to insert mocks
    var ps = [];
    ps.push(hardcodedMock());
    ts_promise_1["default"].all(ps).then(function () {
        return customers.find("name", "", { startsWith: true });
    }).then(function (cs) {
        _.each(cs, function (customer) {
            var cus = { id: customer.id,
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
                payment_customer_token: customer.payment_customer_token,
                payment_customer_id: customer.payment_customer_id
            };
            if (cus["is_doorman"]) {
                cus["is_doorman"] = 1;
            }
            var query = connection.query('INSERT INTO etl_customers SET ?', cus, function (error, results, fields) {
                if (error)
                    throw error;
            });
        });
        return customer_cards.find("customer_id", "", { startsWith: true });
    }).then(function (crds) {
        console.log("cards lengt");
        console.log(crds.length);
        _.each(crds, function (card) {
            var crd = { id: card.id,
                customer_id: card.customer_id,
                card_id: card.card_id,
                brand: card.brand,
                last4: card.last4
            };
            if (card["is_default"]) {
                crd["is_default"] = 1;
            }
            console.log(crd.id);
            console.log(crd.customer_id);
            console.log(crd.card_id);
            console.log(crd.brand);
            console.log(crd.last4);
            console.log(crd.is_default);
            var query = connection.query('INSERT INTO etl_customer_cards SET ?', crd, function (error, results, fields) {
                console.log(error);
                if (error)
                    throw error;
            });
        });
        disconnect();
        done();
    })["catch"](_.noop);
});
