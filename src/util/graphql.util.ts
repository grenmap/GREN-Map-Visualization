/**
 * Copyright 2020 GRENMap Authors
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
 * This file contains a helper functions for building graphql queries
 */

/**
 * Converts an object to a query compatable with graphql
 */
export function objectToQueryString(query: object): string {
    if (!query || Object.keys(query).length === 0) { return ''; }
    return `(${Object.keys(query).reduce((prev, current, index) => {
        if (index !== 0) { prev += ', '; }
        return `${prev}${current}:${JSON.stringify(query[current])}`;
    }, '')})`;
}

/**
 * Converts an object to a projection string compatable with graphql
 */
export function arrayToProjectionString(projection: (string | object)[]): string {
    if (!projection || projection.length === 0) { return ''; }
    return `${projection.reduce((prev, current, index) => {
        if (index !== 0) { prev += '\n'; }
        return `${prev}${typeof current === 'string' ? current : objectToProjectionString(current as Record<string, string[]>)}`;
    })}`;
}

/**
 * Converts an object to a projection string
 */
function objectToProjectionString(projection: Record<string, string[]>): string {
    const key = Object.keys(projection)[0];
    return `${key} {${arrayToProjectionString(projection[key])}}`;
}
