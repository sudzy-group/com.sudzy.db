Import pouchdb
Import Customer entity and Customers collection

import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as faker from 'faker';
import Promise from "ts-promise";
import * as express from "express";
import * as expressPouchdb from "express-pouchdb";

import { Customers } from "../src/collections/Customers";
import {Customer} from "../src/entities/Customer";




   var app = express();
    app.use('/', expressPouchdb(PouchDB));
    app.listen(5555);
    MockTest.db = new PouchDB("http://localhost:5555/mocks");
    MockTest.customers = new Customers(MockTest.db, Customer);