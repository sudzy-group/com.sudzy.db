import { Promise } from 'ts-promise';
import { ApplicationSettings } from 'pouchable/dist/src';

/**
 * The store configuration object
 * @class Store
 */
export class Store {

    private _config = {};

    private _items = {};

    constructor(private _applicationSettings: ApplicationSettings) { }

    /**
     * Load store configuration from local db
     * @returns {Promise<Store>} 
     */
    load(): Promise<Store> {
        let t = this;
        return new Promise<Store>((resolve, reject) => {
            this._applicationSettings.get('config').then((config) => {
                this._config = config;
                return this._applicationSettings.get('items');
            }).then((items) => {
                this._items = items;
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Save store configuration to local db
     * @param {object} config 
     * @param {object} items 
     * @returns {Promise<Store>} 
     */
    save(config: object, items: object): Promise<Store> {
        let t = this;
        return new Promise<Store>((resolve, reject) => {
            this._config = config;
            this._items = items;
            this._applicationSettings.set('config', config).then(() => {
                return this._applicationSettings.set('items', items);
            }).then(() => {
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Store id
     */
    get id() {
        return this.get('id');
    }

    /**
     * Store configuration 
     * @memberOf Store
     */
    get(key) {
        return this._config[key];
    }

    /**
     * Returns the Store Item given isbn
     * @param {any} string 
     * @memberOf Store
     */
    item(isbn: string): object {
        return this._items[isbn];
    }
}

