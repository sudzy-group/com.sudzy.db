"use strict";
exports.__esModule = true;
var PouchDB = require("pouchdb");
var _ = require("lodash");
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
var config = {
    "port": 5555,
    "pouchURL": "http://localhost:5555/mocks"
};
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
    customers = new Customers_1.Customers(pouch, Customer_1.Customer);
    customer_cards = new CustomerCards_1.CustomerCards(pouch, CustomerCard_1.CustomerCard);
    orders = new Orders_1.Orders(pouch, Order_1.Order);
    deliveries = new Deliveries_1.Deliveries(pouch, Delivery_1.Delivery);
    order_items = new OrderItems_1.OrderItems(pouch, OrderItem_1.OrderItem);
    order_tags = new OrderTags_1.OrderTags(pouch, OrderTag_1.OrderTag);
    order_charges = new OrderCharges_1.OrderCharges(pouch, OrderCharge_1.OrderCharge);
}
function connectSQL() {
    SQLconnection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'pouch',
        multipleStatements: true
    });
    SQLconnection.connect(function (err) {
        if (err) {
            console.error('error connecting to mysql: ' + err.stack);
            return;
        }
        console.log('connected to mysql');
        SQLconnection.query('DELETE FROM etl_customers; DELETE FROM etl_customer_cards; DELETE FROM etl_orders; DELETE FROM etl_order_items; DELETE FROM etl_order_tags; DELETE FROM etl_order_charges; DELETE FROM etl_deliveries;', function (error, results, fields) {
            if (error)
                throw error;
        });
    });
}
function copyPouchToSQL() {
    pouch.info().then(function (info) {
        return customers.find("name", "", { startsWith: true });
    }).then(function (cs) {
        //1. Copy customers from pouch to sql
        if (cs.length > 0) {
            _.each(cs, function (customer) {
                var cus = {
                    id: customer.id,
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
                    payment_customer_id: customer.payment_customer_id,
                    is_doorman: customer.is_doorman ? 1 : 0
                };
                var query = SQLconnection.query('INSERT INTO etl_customers SET ?', cus, function (error, results, fields) {
                    if (error)
                        throw error;
                });
            });
        }
        return customer_cards.find("customer_id", "", { startsWith: true });
    }).then(function (crds) {
        //2. Copy customer cards from pouch to sql 
        if (crds.length > 0) {
            _.each(crds, function (card) {
                var crd = {
                    id: card.id,
                    customer_id: card.customer_id,
                    card_id: card.card_id,
                    brand: card.brand,
                    last4: card.last4,
                    is_default: card.is_default ? 1 : 0
                };
                var query = SQLconnection.query('INSERT INTO etl_customer_cards SET ?', crd, function (error, results, fields) {
                    if (error)
                        throw error;
                });
            });
        }
        return orders.find("customer_id", "", { startsWith: true });
    }).then(function (ords) {
        //3. Copy orders from pouch to sql	   
        if (ords.length > 0) {
            _.each(ords, function (order) {
                var ord = {
                    id: order.id,
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
                };
                var query = SQLconnection.query('INSERT INTO etl_orders SET ?', ord, function (error, results, fields) {
                    if (error)
                        throw error;
                });
            });
        }
        return order_items.find("order_id", "", { startsWith: true });
    }).then(function (ord_items) {
        //4. Copy order items from pouch to sql	
        if (ord_items.length > 0) {
            _.each(ord_items, function (order_item) {
                var ord_item = {
                    id: order_item.id,
                    order_id: order_item.order_id,
                    item_id: order_item.item_id,
                    name: order_item.name,
                    total_price: order_item.total_price,
                    quantity: order_item.quantity,
                    notes: order_item.notes,
                    separate: order_item.separate ? 1 : 0,
                    wash: order_item.wash ? 1 : 0,
                    dry: order_item.dry ? 1 : 0,
                    detergent: order_item.detergent,
                    color: order_item.color,
                    pattern: order_item.pattern,
                    brand: order_item.brand,
                    fabric: order_item.fabric,
                    alteration_type: order_item.alteration_type
                };
                var query = SQLconnection.query('INSERT INTO etl_order_items SET ?', ord_item, function (error, results, fields) {
                    if (error)
                        throw error;
                });
            });
        }
        return order_tags.find("order_id", "", { startsWith: true });
    }).then(function (ord_tags) {
        //5. Copy order tagss from pouch to sql	
        if (ord_tags.length > 0) {
            _.each(ord_tags, function (order_tag) {
                var ord_tag = {
                    id: order_tag.id,
                    order_id: order_tag.order_id,
                    tag_number: order_tag.tag_number
                };
                var query = SQLconnection.query('INSERT INTO etl_order_tags SET ?', ord_tag, function (error, results, fields) {
                    if (error)
                        throw error;
                });
            });
        }
        return order_charges.find("order_id", "", { startsWith: true });
    }).then(function (ord_charges) {
        //6. Copy order charges from pouch to sql	
        if (ord_charges.length > 0) {
            _.each(ord_charges, function (order_charge) {
                var ord_charge = {
                    id: order_charge.id,
                    order_id: order_charge.order_id,
                    amount: order_charge.amount,
                    charge_type: order_charge.charge_type,
                    charge_id: order_charge.charge_id,
                    card_id: order_charge.card_id,
                    date_cash: order_charge.date_cash ? new Date(order_charge.date_cash) : null,
                    refund_id: order_charge.refund_id,
                    amount_refunded: order_charge.amount_refunded
                };
                var query = SQLconnection.query('INSERT INTO etl_order_charges SET ?', ord_charge, function (error, results, fields) {
                    if (error)
                        throw error;
                });
            });
        }
        return deliveries.find("delivery_time", "", { startsWith: true });
    }).then(function (delivs) {
        //7. Copy deliveries from pouch to sql	
        if (delivs.length > 0) {
            var amount_1 = delivs.length;
            var i_1 = 0;
            _.each(delivs, function (delivery) {
                var deliv = {
                    id: delivery.id,
                    customer_id: delivery.customer_id,
                    is_pickup: delivery.is_pickup ? 1 : 0,
                    delivery_time: new Date(delivery.delivery_time),
                    delivery_person: delivery.delivery_person,
                    is_confirmed: delivery.is_confirmed ? 1 : 0,
                    is_canceled: delivery.is_canceled ? 1 : 0,
                    express_id: delivery.express_id
                };
                var query = SQLconnection.query('INSERT INTO etl_deliveries SET ?', deliv, function (error, results, fields) {
                    if (error)
                        throw error;
                    i_1++;
                    if (i_1 == amount_1) {
                        console.log("About to disconnect");
                        disconnectSQL();
                    }
                });
            });
        }
        else {
            console.log("About to disconnect");
            disconnectSQL();
        }
    })["catch"](_.noop);
}
;
function disconnectSQL() {
    SQLconnection.destroy();
}
;
