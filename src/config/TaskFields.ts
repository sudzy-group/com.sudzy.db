import { Promise } from 'ts-promise';
import { ApplicationSettings } from 'pouchable';
import { keys, keyBy } from 'lodash';

/**
 * Task Field information
 * @class TaskField
 */
export class TaskField {
    constructor(private _data: any) { }
    get id():               string  { return this._data['id'] };
    get type():             string  { return this._data['type'] };
    get name():             string  { return this._data['name'] };
    get icon():             string  { return this._data['icon'] };
    get is_required():      boolean { return this._data['is_required'] };
    get is_multiple():      boolean { return this._data['is_multiple'] };
    get is_productivity():  boolean { return this._data['is_productivity'] };
    get selection():        string  { return this._data['selection'] };    
}

/**
 * The task fields configuration object
 * @class TaskFields
 */
export class TaskFields {

    private _fields = {};

    constructor(private _applicationSettings: ApplicationSettings) { }

    /**
     * Save Task Fields to local db
     * @param {any} fields 
     * @returns {Promise<TaskFields>} 
     */
    save(fields: any): Promise<TaskFields> {
        let t = this;
        return new Promise<TaskFields>((resolve, reject) => {
            t._fields = keyBy(fields, 'id');
            t._applicationSettings.set('fields', t._fields).then(() => {
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }    

    /**
     * Load Task Fields from local db
     * @returns {Promise<TaskFields>} 
     */
    reload(): Promise<TaskFields> {
        let t = this;
        return new Promise<TaskFields>((resolve, reject) => {
            this._applicationSettings.get('fields').then((config) => {
                this._fields = config;
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
        return keys(this._fields);
    }

    /**
     * Task Field by id
     */
    public get(id: any) {
        if (!id || !this._fields[id]) {
            return null;
        }
        return new TaskField(this._fields[id]);
    }
}

