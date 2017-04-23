import { Promise } from 'ts-promise';
import { ApplicationSettings } from 'pouchable';

/**
 * The store configuration object
 * @class Store
 */
export class Store {

    private _config = {};

    constructor(private _applicationSettings: ApplicationSettings) { }

    /**
     * Save store configuration to local db
     * @param {object} config 
     * @returns {Promise<Store>} 
     */
    save(config: any): Promise<Store> {
        let t = this;
        return new Promise<Store>((resolve, reject) => {
            this._config = config;
            this._applicationSettings.set('config', config).then(() => {
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Load store configuration from local db
     * @returns {Promise<Store>} 
     */
    reload(): Promise<Store> {
        let t = this;
        return new Promise<Store>((resolve, reject) => {
            this._applicationSettings.get('config').then((config) => {
                this._config = config;
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
}

