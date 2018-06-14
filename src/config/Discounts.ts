import { Promise } from 'ts-promise';
import { ApplicationSettings } from 'pouchable';
import { keys, keyBy } from 'lodash';

/**
 * Discount information
 * @class Discount
 */
export class Discount {
    constructor(private _data: any) { }
    get id():               number  { return this._data['id'] };
    get name():             string  { return this._data['name'] };
    get itemType():         string  { return this._data['item_type'] };
    get type():             string  { return this._data['type'] };
    get amount():           number  { return this._data['amount'] };
    get isEnabled():        boolean { return this._data['is_enabled'] };
    get isHidden():         boolean { return !this.isEnabled || this._data['is_hidden'] };
    get color():            string  { return this._data['color'] };
}

/**
 * The store configuration object
 * @class Discounts
 */
export class Discounts {

    private _discounts = {};

    constructor(private _applicationSettings: ApplicationSettings) { }

    /**
     * Save store discounts to local db
     * @param {any[]} discounts 
     * @returns {Promise<Discounts>} 
     */
    save(discounts: any[]): Promise<Discounts> {
        let t = this;
        return new Promise<Discounts>((resolve, reject) => {
            t._discounts = keyBy(discounts, 'id');
            t._applicationSettings.set('discounts', t._discounts).then(() => {
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }    

    /**
     * Load store discounts from local db
     * @returns {Promise<Discounts>} 
     */
    reload(): Promise<Discounts> {
        let t = this;
        return new Promise<Discounts>((resolve, reject) => {
            this._applicationSettings.get('discounts').then((config) => {
                t._discounts = config;
                resolve(t);
            }).catch((err) => {
                t._discounts = []
                resolve(t);
            });
        });
    }

    /**
     * Iterable keys
     * @returns {Array<string>} 
     */
    keys(): Array<number> {
        return keys(this._discounts);
    }

    /**
     * Discounts by id
     */
    public get(id: number) {
        if (!id || !this._discounts[id]) {
            return null;
        }
        return new Discount(this._discounts[id]);
    }
}

