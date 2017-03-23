import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as faker from 'faker';
import Promise from "ts-promise";
import * as express from "express";
import * as expressPouchdb from "express-pouchdb";
import * as mysql from "mysql";
import { Customers } from "../src/collections/Customers";
import {Customer} from "../src/entities/Customer";


var app = express();
app.use('/', expressPouchdb(PouchDB));
app.listen(5555);
let db = new PouchDB("http://localhost:5555/mocks");
db.customers = new Customers(db, Customer);

let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'pouch'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting to mysql: ' + err.stack);
    return;
  }
 
  console.log('connected to mysql');
  connection.query('DELETE FROM etl_customers', function (error, results, fields) {
		        if (error) throw error;
		        console.log(results);
		        console.log(fields);
  });
});


let t = this;
db.info().then(function (info, done) {
    console.log(info);
    let customers = db.customers;
    let t = this;
//About to insert mocks
    let ps = [];
    ps.push(hardcodedMock());
    Promise.all(ps).then(()=> {
      return customers.find("name", "", {startsWith: true});
    }).then((cs) => {
    	_.each(cs, function(customer){
	    	let cus  = {id: customer.id, mobile: customer.mobile, name: customer.name};
			var query = connection.query('INSERT INTO etl_customers SET ?', cus, function (error, results, fields) {
		        if (error) throw error;
		        console.log(results);
		        console.log(fields);
	   		});
		});
      disconnect();
      done();
    }).catch(_.noop);
});
    



function hardcodedMock(){
	return new Promise((res, rej) => {
  		let customers = db.customers;
  		let t = this;
  		let customerObj= {
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
		customers.insert(customerObj).then((cust) => {
		    return res(true);
		}).catch(function(m){
  			console.log(m);
  			console.log("Error in mock");
  			return rej(new Error("Error"));
		});
	});
}


function disconnect(done: Function) {
	connection.destroy();
    db.destroy(() => done());
}