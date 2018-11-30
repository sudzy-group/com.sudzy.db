#!/usr/bin/env node
import * as PouchDB from "pouchdb";
import * as PouchableAuthentication from 'pouchdb-authentication';
PouchDB.plugin(PouchableAuthentication);

import * as commander from 'commander';
import * as fs from 'fs';

/**
 * Example: 
 * node lib/tools/checkETLStatus.js --remotePouchDB ****:5984  --storeId *** --filePath ***
 * node lib/tools/checkETLStatus.js --remotePouchDB http://db-1.sudzy.co:5984  --storeId aa0c19ba --filePath ../tmp
 * ./new-etl.sh -r http://db-1.sudzy.co:5984 -s aa0c19ba -f ../../tmp
 */
let p = commander
    .version('0.0.1')
    .usage('[options]')
    .option('-p, --remotePouchDB [value]', 'The remote PouchDB url')
    .option('-s, --storeId [value]', 'The store user')
	.option('-f, --filePath [value]', 'The status csv file')
    .parse(process.argv);

if (!p.remotePouchDB || !p.storeId) {
    console.error('no databases arguments given.');
    process.exit(1);
}

getInfo(info => {
    var fullPath = p.filePath + '/' + p.storeId +  '_db_status.txt';
    fs.readFile(fullPath, 'utf8', function readFileCallback(err, data){
        if (err) {
            fs.writeFile(fullPath, JSON.stringify(info), 'utf8', function() {
                process.exit(1);
            }); 
        } else {
            var bs = JSON.parse(data);
            if (!bs.doc_count || bs.doc_count!=info.doc_count || bs.update_seq!=info.update_seq) {
                fs.writeFile(fullPath, JSON.stringify(info), 'utf8', function() {
                    process.exit(1);
                }); 
            } else {
                process.exit(0);
            }
        }
    });
})

function getInfo(callback) {
    let db = new PouchDB(p.remotePouchDB + "/" + p.storeId, {
      auth: {
          username: p.storeId,
          password: p.storeId
      }
    });
    db.info().then(res => callback(res), err => console.log(err));
}