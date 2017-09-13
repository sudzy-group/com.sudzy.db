import { Promise } from 'ts-promise';
import { ApplicationSettings } from 'pouchable';
import { keys, keyBy } from 'lodash';

/**
 * Employee information
 * @class Employee
 */
export class Employee {
    constructor(private _data: any) { }
    get id():               string  { return this._data['id'] };
    get name():             string  { return this._data['name'] };
    get pincode():          string  { return this._data['pincode'] };
    get role():             number  { return this._data['role'] };
}

/**
 * The store configuration object
 * @class Employees
 */
export class Employees {

    private _employees = {};

    constructor(private _applicationSettings: ApplicationSettings) { }

    /**
     * Save store employees to local db
     * @param {any[]} employees 
     * @returns {Promise<Employees>} 
     */
    save(employees: any[]): Promise<Employees> {
        let t = this;
        return new Promise<Employees>((resolve, reject) => {
            t._employees = keyBy(employees, 'pincode');
            t._applicationSettings.set('employees', t._employees).then(() => {
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }    

    /**
     * Load store employees from local db
     * @returns {Promise<Employees>} 
     */
    reload(): Promise<Employees> {
        let t = this;
        return new Promise<Employees>((resolve, reject) => {
            this._applicationSettings.get('employees').then((config) => {
                this._employees = config;
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
        return keys(this._employees);
    }

    /**
     * Employees by isbn
     */
    public get(pincode: string) {
        if (!pincode || !this._employees[pincode]) {
            return null;
        }
        return new Employee(this._employees[pincode]);
    }
}

