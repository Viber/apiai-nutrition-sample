// Copyright 2017 Viber Media S.à r.l..
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
const req = require('request-promise');
const FoodItem = require(__dirname + '/food-item');
const Nutrient = require(__dirname + '/nutrient');

const API_URL = "https://api.nal.usda.gov/ndb/";
const FETCH_REPORT_ENDPOINT = `${API_URL}reports/`;
const SEARCH_ITEMS_ENDPOINT = `${API_URL}search/`;
const SEARCH_ITEMS_DATA_SOURCE = `Branded Food Products`;
const SEARCH_ITEMS_SORT = `r`;
const SEARCH_ITEMS_DEFAULT_MAX_RESULT = 25;
const RESPONSE_FORMAT = `JSON`;
const FETCH_REPORT_TYPE = `b`;

function NutritionFetcher(API_KEY) {
    this.API_KEY = API_KEY
}

/**
 * Search method to query USDA NDB database.
 * see: https://ndb.nal.usda.gov/ndb/doc/apilist/API-SEARCH.md
 * @param {String} searchTerms The search terms.
 * @param {String} [maxResults = 25] Maximum results to retrieve.
 * @returns {Promise} promise
 */
NutritionFetcher.prototype.searchFoods = function(searchTerms, maxResults) {
    return req({
        method: 'GET',
        url: SEARCH_ITEMS_ENDPOINT,
        json: true,
        qs:{
            api_key: this.API_KEY,
            format: RESPONSE_FORMAT,
            q: searchTerms || '',
            ds: SEARCH_ITEMS_DATA_SOURCE,
            sort: SEARCH_ITEMS_SORT,
            max: maxResults || SEARCH_ITEMS_DEFAULT_MAX_RESULT
        },
        transform: (body) => {

            let foodItems = [];

            if (body.list.item) {
                for(let item of body.list.item) {
                    foodItems.push(FoodItem.fromJson(item));
                }
            }
            
            return foodItems;
        }
    })
};

/**
 * Get nutritions method to retrieve individual food item nutrition facts. 
 * see: https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORT.md
 * @param {FoodItem} Food item as fetched from the searchFoods function.
 * @returns {Promise} promise
 */
NutritionFetcher.prototype.getNutritions = function(foodItem) {
	if (!foodItem) throw new Error("food item must be non-null");

    return req({
        method: 'GET',
        url: FETCH_REPORT_ENDPOINT,
        json: true,
        qs:{
            api_key: this.API_KEY,
            format: RESPONSE_FORMAT,
            ndbno: foodItem.foodId,
            type: FETCH_REPORT_TYPE
        },
        transform: (body) => {
            let nutrients = [];

            if (body.report.food.nutrients) {
                for(let item of body.report.food.nutrients) {
                    nutrients.push(Nutrient.fromJson(item));
                }
            }
            
            return nutrients;
        }
    })
};

module.exports = NutritionFetcher;