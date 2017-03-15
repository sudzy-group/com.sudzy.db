import * as PouchDB from 'pouchdb';
import Promise from 'ts-promise';
PouchDB.plugin(require('pouchdb-authentication'));

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
    public constructor(name : string) {
        this._db = new PouchDB(name);
    }

    public connect(remoteHost: string, remoteDb: string, remoteUser: string, remotePass: string) {
        if (!remoteHost || !remoteUser || !remotePass) {
            throw new Error("Internal - cannot connect to local/remote server")
        }
        let url = remoteHost + "/" + remoteDb;
        this._remoteDb = new PouchDB(url, {
            auth: {
                username: remoteUser,
                password: remotePass
            }
        });
        let opts = {
            body : {name: remoteUser, password: remotePass}
        }
        return this._remoteDb.login(remoteUser, remotePass, opts);
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