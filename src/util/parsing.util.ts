/**
 * Copyright 2021 GRENMap Authors
 *
 * SPDX-License-Identifier: Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------------
 * This file contains the functionality to manipulate the data in the query
 * service to be easier to work with
 */

/**
 * Returns a coppied object with the properties parsed into a map from
 * an array. Copying the object like this makes the values mutable,
 * which is needed since graphql returns immutable data.
 * This function calls itself recursively to parse properties of owners,
 * if they are present on the passed input
 */
export function copyAndParsePropertiesAndOwnerProperties<T extends RawPropertyContainer>(input: T) {
    let owners = (input as RawOwnerContainer | OwnerContainer).owners;
    // If owners is defined, parse its properties as well
    if (!!owners) {
      owners = owners.map(owner => copyAndParsePropertiesAndOwnerProperties(owner));
    }
    // Converts the properties to a map from an array format
    const properties = propertyArrayToMap(
      (input.properties || []) as Property[]
    );
    // Return a coppied object to give a mutable reference to fields
    return {
      ...input,
      properties,
      owners
    } as (OmitRaw<T> & PropertyContainer);
  }

/**
 * Converts an array of properties to a map object containing the properties
 * in a key:value format
 */
export function propertyArrayToMap(properties: Property[]) {
    // key:value map of properties
    const returnMap = {} as Record<string, string[]>;
    for (const entry of properties) {
      // Sets the value to an empty array if it does not yet exist
      if (!returnMap[entry.name]) { returnMap[entry.name] = []; }
      // Adds the value to the array
      returnMap[entry.name].push(entry.value);
    }
    return returnMap;
}
