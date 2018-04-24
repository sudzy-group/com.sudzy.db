import { Promise } from 'ts-promise';
import { ApplicationSettings } from 'pouchable';
import { groupBy } from 'lodash';

/**
 * The store configuration object
 * @class Modifiers
 */
export class Modifiers {

    private _modifiers = {};

    constructor(private _applicationSettings: ApplicationSettings) { }

    /**
     * Save store modifiers to local db
     * @param {any} modifiers 
     * @returns {Promise<Store>} 
     */
    save(modifiers: any): Promise<Modifiers> {
        let t = this;
        return new Promise<Modifiers>((resolve, reject) => {
            this._modifiers = modifiers;
            this._applicationSettings.set('modifiers', modifiers).then(() => {
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }    

    /**
     * Load store modifiers from local db
     * @returns {Promise<Store>} 
     */
    reload(): Promise<Modifiers> {
        let t = this;
        return new Promise<Modifiers>((resolve, reject) => {
            this._applicationSettings.get('modifiers').then((config) => {
                this._modifiers = config;
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Modifiers by isbn
     */
    public findBy(group: string) {
        if (!group) {
            return null;
        }
        let grouped = groupBy(this._modifiers, 'isbn');
        return grouped[group];
    }
}

