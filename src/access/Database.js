"use strict";
exports.__esModule = true;
var PouchDB = require("pouchdb");
var ts_promise_1 = require("ts-promise");
PouchDB.plugin(require('pouchdb-authentication'));
/**
 * Acess database local and remotely
 * User authenticated
 */
var Database = (function () {
    /**
     * Setup local database
     * @param name
     */
    function Database(name) {
        this._db = new PouchDB(name);
    }
    Database.prototype.connect = function (remoteHost, remoteDb, remoteUser, remotePass) {
        var t = this;
        return new ts_promise_1["default"](function (resolved, rejected) {
            if (!remoteHost || !remoteUser || !remotePass) {
                throw new Error("Internal - cannot connect to local/remote server");
            }
            var url = remoteHost + "/" + remoteDb;
            t._remoteDb = new PouchDB(url, {
                auth: {
                    username: remoteUser,
                    password: remotePass
                }
            });
            resolved(t);
        });
    };
    Object.defineProperty(Database.prototype, "db", {
        /**
         * Direct access to local database
         */
        get: function () {
            return this._db;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Query remote database status
     */
    Database.prototype.remoteStatus = function () {
        return this._remoteDb.info();
    };
    /**
     * Query local database status
     */
    Database.prototype.localStatus = function () {
        return this._db.info();
    };
    /**
     * sync the local with remote
     * @param options
     */
    Database.prototype.sync = function (options) {
        return this._db.sync(this._remoteDb, options);
    };
    return Database;
}());
exports.Database = Database;
