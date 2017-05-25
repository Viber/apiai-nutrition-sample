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

function Nutrient(nutrientId, name, unit, value) {
    this.nutrientId = nutrientId;
    this.name = name;
    this.unit = unit;
    this.value = value;
	Object.freeze(this);
}

Nutrient.fromJson = function(jsonMessage) {
	if (!jsonMessage) throw new Error("Json data must be non-null");
	return new Nutrient(jsonMessage.nutrient_id, jsonMessage.name, jsonMessage.unit, jsonMessage.value);
};

module.exports = Nutrient;