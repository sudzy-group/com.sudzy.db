import { Promise } from 'ts-promise';
import { map, forIn } from 'lodash';
import * as https from 'https';
import * as commander from 'commander';
import * as csv from 'csvtojson';
import * as util from 'util';
import * as querystring from 'querystring';
import * as async from 'async';

let p = commander
  .version('0.0.1')
  .usage('[options]')
	.option('-f, --autocompleteFile [value]', 'The addresses csv file')
	.parse(process.argv);

if (!p.autocompleteFile) {
   console.error('no addresses arguments given.');
   process.exit(1);
}

/**
 * Google Autocomplete Service to help with typeahead of addresses
 * 
 * @export
 * @class GoogleAutocompleteService
 */
export class GoogleAutocompleteService {

	/**
	 * Get google autocomplete suggestions
	 * @param {string} input 
	 * @param {any} center 
	 * @returns {Promise<Place[]>} 
	 */
	public autocomplete(input: string, center): Promise<Place[]> {

		return new Promise<Place[]>((resolve, reject) => {
			var queryParams = querystring.stringify({input: input, key: 'AIzaSyBnVZV3mK99RV8RjOZEc32mMjYIkbcYC7w', location: center.latitude + ',' + center.longitude, radius : '3000'});
			let url = this._getHost() + '/maps/api/place/autocomplete/json?';
			this.get(url +  queryParams,
				body => {
					let result = null;
					try {
						result = JSON.parse(body);
					} catch(e) {
						console.log(e, body)
					}
					return result.predictions ? resolve(this.toPlaces(result.predictions)) : reject(null);
				}
			);
		});
	}

	/**
	 * Get details for a given place
	 * @param {Place} place 
	 * @param {any} center 
	 * @returns {Promise<any>} 
	 */
	public details(place: Place): Promise<Place> {
		return new Promise<Place>((resolve, reject) => {
			if (!place) {
				resolve(null);
			}
			var queryParams = querystring.stringify({key: 'AIzaSyBnVZV3mK99RV8RjOZEc32mMjYIkbcYC7w', placeid: place.placeid});
			let url = this._getHost() + '/maps/api/place/details/json?';
			this.get(url + queryParams, 
				body => {
					let result = JSON.parse(body);
					return result.result ? resolve(result.result) : reject(null);
				}
			);
		});
	}

	private _getHost() {
		return 'https://maps.googleapis.com';
	}

	private toPlaces(predictions: any[]): Place[] {
		return map(predictions, (p) => {
			return {
				placeid: p.place_id,
				full: p.description,
			};
		})
	}

  private get(url, callback) {
    return https.get(url, function(response) {
        var body = '';
        response.on('data', function(d) {
          body += d;
        });
        response.on('end', function() {
          callback(body);
        });
    });

  }
}

export interface Place {
	placeid: string;
	full: string;
	street?: string;
	city?: string;
	state?: string;
	country?: string;
	zipcode?: string;
}

function loadAddresses(callback) {
	let customer = [];
	csv()
	.fromFile(p.autocompleteFile)
	.on('json',(jsonObj)=>{
		customer.push(jsonObj);
	})
	.on('done',(error)=>{
		callback(customer);
	})
}

function toPlace(result) {
	let output = {};
	let cs =  result.address_components;
	cs.forEach(c => {
		output[c.types[0]] = c.short_name;
	})
	output['autocomplete'] = result.formatted_address;
	if (result.geometry && result.geometry.location) {
		output['lat'] = result.geometry.location.lat;
		output['lng'] = result.geometry.location.lng;
	}
	return output;
}

function resolveAddress(address) {
	return (callback) => {
		acs.autocomplete(address, {"longitude": -74.031265, "latitude": 40.9912}).then(ps => {
			if (ps && ps.length > 0) {
				return acs.details(ps[0]).then(d => {
					let p: any = toPlace(d);
					console.log('"' + p.autocomplete + '","' + p.street_number + '","' + p.route + '","' + (p.locality || p.sublocality_level_1) + '","' + p.administrative_area_level_1 + '","' + p.country + '","' + p.postal_code + '",' +p.lat + ',' + p.lng);
					return callback(null, '"' + p.autocomplete + '","' + p.street_number + '","' + p.route + '","' + (p.locality || p.sublocality_level_1) + '","' + p.administrative_area_level_1 + '","' + p.country + '","' + p.postal_code + '"');
				})
			};
			console.log("")
			return callback(null, "");
		})	
	}
}

let acs = new GoogleAutocompleteService();
loadAddresses(ads => {
	let ps = [];
	ads.forEach(a => {
		ps.push(resolveAddress(a.address));
	})
	async.series(ps, // optional callback
		function(err, results) {
				console.log(err, results)
		}
	);
})
