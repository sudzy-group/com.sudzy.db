import * as PouchDB from 'pouchdb';
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
        this._remoteDb = new PouchDB(url, { skip_setup: true});
        let t = this;
        let opts = {
            body : {name: remoteUser, password: remotePass}
        }
        return this._remoteDb.login(remoteUser, remotePass, opts);
    }

    public sync(options?) {
        return this._db.sync(this._remoteDb, options)  
    }

    get db() {
        return this._db;
    }

    public status(error, response)  {
        if (!this._remoteDb) {
            return error("remote not connected");
        }

        this._remoteDb.getSession(function (err, response) {
            if (err) {
                error(err)
            } else if (!response.userCtx.name) {
                error("no one connected")
            } else {
                response(response);
            }
        });
    }

}