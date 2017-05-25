#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PouchDB = require("pouchdb");
var PouchableAuthentication = require("pouchdb-authentication");
PouchDB.plugin(PouchableAuthentication);
var _ = require("lodash");
var ts_promise_1 = require("ts-promise");
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
var commander = require("commander");
var p = commander
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
if (!p.remotePouchDB || !p.remoteMySQLHost || !p.remoteMySQLUser || !p.remoteMySQLDatabase) {
    console.error('no databases arguments given.');
    process.exit(1);
}
var pouch;
var customers, customer_cards, orders, deliveries, order_items, order_tags, order_charges;
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
        host: p.remoteMySQLHost,
        user: p.remoteMySQLUser,
        password: p.remoteMySQLPassword,
        database: p.remoteMySQLDatabase,
        multipleStatements: true
    });
    SQLconnection.connect(function (err) {
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
    pouch.info().then(function (info) {
        return customers.find("name", "", { startsWith: true });
    }).then(function (cs) {
        var ps = getPromises(cs, customerConvertor, 'etl_customers');
        return ts_promise_1.default.all(ps);
    }).then(function (results) {
        /////////////////////
        // Customers Cards
        /////////////////////		
        return customer_cards.find("customer_id", "", { startsWith: true });
    }).then(function (crds) {
        var ps = getPromises(crds, customerCardsConvertor, 'etl_customer_cards');
        return ts_promise_1.default.all(ps);
    }).then(function (results) {
        /////////////////////
        // Orders
        /////////////////////		
        return orders.find("customer_id", "", { startsWith: true });
    }).then(function (ords) {
        var ps = getPromises(ords, ordersConvertor, 'etl_orders');
        return ts_promise_1.default.all(ps);
    }).then(function (results) {
        /////////////////////
        // Order Items
        /////////////////////		
        return order_items.find("order_id", "", { startsWith: true });
    }).then(function (ord_items) {
        var ps = getPromises(ord_items, orderItemsConvertor, 'etl_order_items');
        return ts_promise_1.default.all(ps);
    }).then(function (results) {
        /////////////////////
        // Order Tags
        /////////////////////		
        return order_tags.find("order_id", "", { startsWith: true });
    }).then(function (ord_tags) {
        var ps = getPromises(ord_tags, orderTagsConvertor, 'etl_order_tags');
        return ts_promise_1.default.all(ps);
    }).then(function (results) {
        /////////////////////
        // Order Charges
        /////////////////////		
        return order_charges.find("order_id", "", { startsWith: true });
    }).then(function (ord_charges) {
        var ps = getPromises(ord_charges, orderChargesConvertor, 'etl_order_charges');
        return ts_promise_1.default.all(ps);
    }).then(function (results) {
        /////////////////////
        // Deliveries
        /////////////////////		
        return deliveries.find("delivery_time", "", { startsWith: true });
    }).then(function (delivs) {
        var ps = getPromises(delivs, deliveriesConvertor, 'etl_deliveries');
        return ts_promise_1.default.all(ps);
    }).then(function (results) {
        console.log("Disconnecting");
        disconnectSQL();
    }).catch(function (m) {
        console.log(m);
        disconnectSQL(1);
    });
}
;
function disconnectSQL(status) {
    if (status === void 0) { status = 0; }
    SQLconnection.destroy();
    process.exit(status);
}
;
function insert(table, data) {
    return new ts_promise_1.default(function (resolve, reject) {
        SQLconnection.query('INSERT INTO ' + table + ' SET ?', data, function (error, results, fields) {
            resolve(results);
        });
    });
}
function getPromises(es, convertor, tableName) {
    console.log("Preparing conversion to ." + tableName);
    console.log("Entities to convert: ", es.length);
    var ps = [];
    _.each(es, function (e) {
        ps.push(insert(tableName, convertor(e)));
    });
    return ps;
}
function customerConvertor(customer) {
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
function customerCardsConvertor(card) {
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
    };
}
function ordersConvertor(order) {
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
        all_ready: order.all_ready ? 1 : 0,
        all_pickedup: order.all_pickedup ? 1 : 0,
        delivery_pickup_id: order.delivery_pickup_id,
        delivery_dropoff_id: order.delivery_dropoff_id
    };
}
function orderItemsConvertor(order_item) {
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
    };
}
function orderTagsConvertor(order_tag) {
    return {
        original_id: order_tag.id,
        created_at: new Date(order_tag._base.core.created_at),
        order_id: order_tag.order_id,
        tag_number: order_tag.tag_number,
        is_rack: order_tag.is_rack
    };
}
function orderChargesConvertor(order_charge) {
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
    };
}
function deliveriesConvertor(delivery) {
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
    };
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
