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
 * This file contains GraphQL queries for links
 */
import { objectToQueryString, arrayToProjectionString } from '../util/graphql.util';


/**
 * Builds a GraphQL query based on the desired links
 */
export function queryLink(query: MapLink, fields: (string | object)[]): string {
    return `
  query {
    link${objectToQueryString(query)} {
      ${arrayToProjectionString(fields)}
    }
  }
`;
}

/**
 * Builds a GraphQL query to find the desired links
 */
export function queryLinks(query: MapLinks, fields: (string | object)[]): string {
    return `
    query {
      links${objectToQueryString(query)} {
        ${arrayToProjectionString(fields)}
      }
    }
  `;
}
