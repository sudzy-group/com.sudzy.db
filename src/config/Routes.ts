import { Promise } from 'ts-promise';
import { ApplicationSettings } from 'pouchable';
import { keys, keyBy } from 'lodash';

/**
 * Route information
 * @class Route
 */
export class Route {
    constructor(private _data: any) { }
    get id():               string  { return this._data['id'] };
    get name():             string  { return this._data['name'] };
    get description():      string  { return this._data['description'] };
    get is_enabled():       boolean { return this._data['is_enabled'] };
    get day_of_week():      string { return this._data['day_of_week'] };
    get ends_at():          string { return this._data['ends_at'] };
    get starts_at():        string { return this._data['starts_at'] };
    get text_day():         string { return this._data['text_day'] };
    get text_hour():        string { return this._data['text_hour'] };
    get text_template():    string { return this._data['text_template'] };
    get timezone():         string { return this._data['timezone'] };
}

/**
 * The routes configuration object
 * @class Routes
 */
export class Routes {

    private _routes = {};

    constructor(private _applicationSettings: ApplicationSettings) { }

    /**
     * Save routes to local db
     * @param {any} routes 
     * @returns {Promise<Routes>} 
     */
    save(routes: any): Promise<Routes> {
        let t = this;
        return new Promise<Routes>((resolve, reject) => {
            t._routes = keyBy(routes, 'id');
            t._applicationSettings.set('routes', t._routes).then(() => {
                resolve(t);
            }).catch((err) => {
                reject(err);
            });
        });
    }    

    /**
     * Load routes from local db
     * @returns {Promise<Routes>} 
     */
    reload(): Promise<Routes> {
        let t = this;
        return new Promise<Routes>((resolve, reject) => {
            this._applicationSettings.get('routes').then((config) => {
                this._routes = config;
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
        return keys(this._routes);
    }

    /**
     * Route by id
     */
    public get(id: any) {
        if (!id || !this._routes[id]) {
            return null;
        }
        return new Route(this._routes[id]);
    }
}
