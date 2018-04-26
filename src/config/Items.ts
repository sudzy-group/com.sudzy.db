import { Promise } from 'ts-promise';
import { ApplicationSettings } from 'pouchable';
import { keys } from 'lodash';

/**
 * Item information
 * @class Item
 */
export class Item {
    constructor(private _data: any) { }
    get isbn():             string  { return this._data['isbn'] };
    get type():             string  { return this._data['type'] };
    get name():             string  { return this._data['name'] };
    get measurement():      string  { return this._data['measurement'] };
    get data_uri():         string  { return this._data['data_uri'] };
    get default_quantity(): number  { return this._data['default_quantity'] };
    get hidden():           boolean { return this._data['hidden'] };
    get color():            boolean { return this._data['color'] };
    get price():            number  { return this._data['price'] };
    get first_x():          number  { return this._data['first_x'] };
    get first_x_price():    number  { return this._data['first_x_price'] };
    get priority():         number  { return this._data['priority'] };
    get pricing_group():    string  { return this._data['pricing_group'] };    
    get parent_isbn():      string  { return this._data['parent_isbn'] };
    get upcharges():        any[]   { return this._data['upcharges'] };
    get tax_rate():         number  { return this._data['tax_rate'] };
}

/**
 * The store items configuration object
 * @class Items
 */
export class Items {

    private _items = {};

    constructor(private _applicationSettings: ApplicationSettings) { }

    /**
     * Save store items to local db
     * @param {any} items 
     * @returns {Promise<Store>} 
     */
    save(items: any): Promise<Items> {
        let t = this;
        return new Promise<Items>((resolve, reject) => {
            this._items = items;
            this._applicationSettings.set('items', items).then(() => {
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }    

    /**
     * Load store items from local db
     * @returns {Promise<Store>} 
     */
    reload(): Promise<Items> {
        let t = this;
        return new Promise<Items>((resolve, reject) => {
            this._applicationSettings.get('items').then((config) => {
                this._items = config;
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Iterable keys
     * @returns {Array<string>} 
     */
    keys(): Array<string> {
        return keys(this._items);
    }

    /**
     * Items by isbn
     */
    public get(isbn: string) {
        if (!isbn) {
            return null;
        }
        return new Item(this._items[isbn]);
    }
}

