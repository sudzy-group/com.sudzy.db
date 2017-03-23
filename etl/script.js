"use strict";
exports.__esModule = true;
var PouchDB = require("pouchdb");
var _ = require("lodash");
var ts_promise_1 = require("ts-promise");
var express = require("express");
var expressPouchdb = require("express-pouchdb");
var mysql = require("mysql");
var Customers_1 = require("../src/collections/Customers");
var Customer_1 = require("../src/entities/Customer");
var app = express();
app.use('/', expressPouchdb(PouchDB));
app.listen(5555);
var db = new PouchDB("http://localhost:5555/mocks");
db.customers = new Customers_1.Customers(db, Customer_1.Customer);
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pouch'
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting to mysql: ' + err.stack);
        return;
    }
    console.log('connected to mysql');
    connection.query('DELETE FROM etl_customers', function (error, results, fields) {
        if (error)
            throw error;
        console.log(results);
        console.log(fields);
    });
});
var t = this;
db.info().then(function (info, done) {
    console.log(info);
    var customers = db.customers;
    var t = this;
    //About to insert mocks
    var ps = [];
    ps.push(hardcodedMock());
    ts_promise_1["default"].all(ps).then(function () {
        return customers.find("name", "", { startsWith: true });
    }).then(function (cs) {
        _.each(cs, function (customer) {
            var cus = { id: customer.id, mobile: customer.mobile, name: customer.name };
            var query = connection.query('INSERT INTO etl_customers SET ?', cus, function (error, results, fields) {
                if (error)
                    throw error;
                console.log(results);
                console.log(fields);
            });
        });
        disconnect();
        done();
    })["catch"](_.noop);
});
function hardcodedMock() {
    var _this = this;
    return new ts_promise_1["default"](function (res, rej) {
        var customers = db.customers;
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
        //Insert customer
        customers.insert(customerObj).then(function (cust) {
            return res(true);
        })["catch"](function (m) {
            console.log(m);
            console.log("Error in mock");
            return rej(new Error("Error"));
        });
    });
}
function disconnect(done) {
    connection.destroy();
    db.destroy(function () { return done(); });
}
