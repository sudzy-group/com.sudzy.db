import {Customer} from '../src/entities/Customer';
import {Customers} from '../src/collections/Customers';
import { suite, test, timeout } from "mocha-typescript";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import { Database } from '../src/access/Database';
import * as express from "express";
import * as expressPouchdb from "express-pouchdb";
import * as Security from 'pouchdb-security'
import * as Authentication from 'pouchdb-authentication';
import * as rimraf from 'rimraf';

@suite("Access Database")
class DatabaseAccess {

    static _server;
    static _db : any;

    static before(done) {
        PouchDB.plugin(Authentication);
        PouchDB.plugin(Security)
        var app = express();
        app.use('/', expressPouchdb(PouchDB));
        DatabaseAccess._server = app.listen(5555);
        DatabaseAccess._db = new PouchDB("http://localhost:5555/aa0c19ba");
        DatabaseAccess._db.signup('aa0c19ba', 'aa0c19ba').then((resp) => {
            done();
        }).catch((m) => {
        	console.log(m)
            throw new Error("couldn't set security rulls")
        })
    }

    static after(done) {
        DatabaseAccess._db.destroy().then(()=> {
            DatabaseAccess._server.close();
            rimraf('{_users,_replicator,pouch__all_dbs__,config.json,log.txt}', function() {
                done();
            })
        }).catch((m) => {
            console.log(m)
        });
    }

    @test("should connect remotely") @timeout(20000)
    public testRemote(done) {
        let access = new Database("aa0c19ba");
        access.connect("http://localhost:5555", "aa0c19ba", "aa0c19ba", "aa0c19ba").then((r) => {
            return access.remoteStatus();
        }).then((response) => {
            const customers = new Customers(access.db, Customer);
            return customers.insert({ mobile: "6465491218" });
        }).then((c) => {
            access.sync().on('complete', () => {
                access.remoteStatus().then(function (result) {
                    if (result.doc_count == 0) {
                        console.log(result);
                        throw new Error("couldn't sync with database");
                    }
                    done()
                }).catch(m=>console.log(m));
            }).on('error', _.noop);
        }).catch((m) => {
            console.log(m)
        });
    }

    @test("should not connect remotely") @timeout(20000)
    public testRemoteFailed(done) {
        let access = new Database("aa0c19ba");
        access.localStatus().then(function (result) {
            if (!result) {
                throw new Error('basic info')
            }
            access.connect("http://localhost:5555", "", "", "").then(_.noop).catch(()=> done());
        });
    }
}
