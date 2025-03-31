var PouchDB = require("pouchdb");
if (PouchDB.default) { // workaround for TypeScript
    PouchDB = PouchDB.default;
}
var PouchableAuthentication = require("pouchdb-authentication");

import Promise from 'ts-promise';

PouchDB.plugin(PouchableAuthentication);

/**
 * Acess database local and remotely
 * User authenticated
 */
export class Database {

    /**
     * Reference to local database
     */
    private _db: any;  

    /**
     * Reference to remote database
     */
    private _remoteDb: any;

    /**
     * Setup local database
     * @param name 
     */
    public constructor(name : string, options?, prepare?: Function) {
        name = name.toLowerCase();
        prepare && prepare(PouchDB);
        this._db = new PouchDB(name, options);
    }

    public connect(remoteHost: string, remoteDb: string, remoteUser: string, remotePass: string) {
        remoteDb = remoteDb.toLowerCase();
        remoteUser = remoteUser.toLowerCase();
        remotePass = remotePass.toLowerCase();
        
        let t = this;
        return new Promise((resolved, rejected) => {
            if (!remoteHost || !remoteUser || !remotePass) {
                throw new Error("Internal - cannot connect to local/remote server")
            }
            let url = remoteHost + "/" + remoteDb;
            t._remoteDb = new PouchDB(url, {
                auth: {
                    username: remoteUser,
                    password: remotePass
                }
            });
            resolved(t);
        }) 
    }

    /**
     * Direct access to local database
     */
    get db() {
        return this._db;
    }

    /**
     * Query remote database status
     */
    public remoteStatus()  {
        return this._remoteDb.info();
    }

    /**
     * Query local database status
     */
    public localStatus()  {
        return this._db.info();
    }

    /**
     * sync the local with remote
     * @param options 
     */
    public sync(options?) {
        return this._db.sync(this._remoteDb, options)  
    }



}