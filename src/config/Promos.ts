import { Promise } from 'ts-promise';
import { ApplicationSettings } from 'pouchable';
import { keys, keyBy } from 'lodash';

/**
 * Promo information
 * @class Promo
 */
export class Promo {
    constructor(private _data: any) { }
    get id():               string  { return this._data['id'] };
    get code():             string  { return this._data['code'] };
    get description():      string  { return this._data['description'] };
    get discountId():       number  { return this._data['discount_id'] };
    get audience():         string  { return this._data['audience'] };
    get isEnabled():        boolean { return this._data['is_enabled'] };
}

/**
 * The store configuration object
 * @class Promos
 */
export class Promos {

    private _promos = {};

    constructor(private _applicationSettings: ApplicationSettings) { }

    /**
     * Save store promos to local db
     * @param {any[]} promos 
     * @returns {Promise<Promos>} 
     */
    save(promos: any[]): Promise<Promos> {
        let t = this;
        return new Promise<Promos>((resolve, reject) => {
            t._promos = keyBy(promos, 'code');
            t._applicationSettings.set('promos', t._promos).then(() => {
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }    

    /**
     * Load store promos from local db
     * @returns {Promise<Promos>} 
     */
    reload(): Promise<Promos> {
        let t = this;
        return new Promise<Promos>((resolve, reject) => {
            this._applicationSettings.get('promos').then((config) => {
                t._promos = config;
                resolve(t);
            }).catch((err) => {
                t._promos = [];
                resolve(t);
            });
        });
    }

    /**
     * Iterable keys
     * @returns {Array<string>} 
     */
    keys(): Array<string> {
        return keys(this._promos);
    }

    /**
     * Promos by id
     */
    public get(code: string) {
        if (!code || !this._promos[code]) {
            return null;
        }
        return new Promo(this._promos[code]);
    }
}

