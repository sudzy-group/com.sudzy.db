#!/usr/bin/env node

import * as PouchDB from 'pouchdb';
import Promise from 'ts-promise';
import * as PouchableAuthentication from 'pouchdb-authentication';

PouchDB.plugin(PouchableAuthentication);

import * as commander from 'commander';

let p = commander
  .version('0.0.1')
  .usage('[options]')
  .option('-p, --remotePouchDB [value]', 'The remote PouchDB url')
  .option('-U, --remotePouchDBUser [value]', 'The remote PouchDB user')
  .option('-P, --remotePouchDBPassword [value]', 'The remote PouchDB password')
  .option('-d, --remotePouchDBName [value]', 'The remote PouchDB database name')  
	.option('-s, --storeId [value]', 'The store id argument')
	.parse(process.argv);


if (!p.remotePouchDB || !p.storeId) {
  console.error('no databases arguments given.');
  process.exit(1);
}

let auth = {
    username: p.remotePouchDBUser,
    password: p.remotePouchDBPassword
};

console.log(auth);

let db = new PouchDB(p.remotePouchDB + ":5984/" + p.remotePouchDBName, {
  auth: auth,
  skip_setup: true
});

db.signup(p.storeId, p.storeId, (err, res) => {
  console.log("err", err);
  console.log("res", res);
})
