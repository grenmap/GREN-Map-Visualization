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
 * Application wide constants
 */

/** Query parameters for most basic fields for nodes */
export const NODE_FIELDS_BASIC = [
  'id', 'name', 'shortName', 'latitude', 'longitude',
  { properties: ['name', 'value'] },
  { owners: [ 'id' ] },
];

/** Query parameters for most basic fields for links */
export const LINK_FIELDS_BASIC = [
    'id', 'name',
    { nodeA: [ 'id', 'latitude', 'longitude' ] },
    { nodeB: [ 'id', 'latitude', 'longitude' ] },
    { properties: ['name', 'value'] },
    { owners: [ 'id' ] },
];

/** Query parameters for most basic fields for institutions */
export const INSTITUTION_FIELDS_BASIC = [
  'id', 'name', 'shortName', 'latitude', 'longitude',
  { properties: ['name', 'value'] }
];

/** Query parameters for all detailed fields for nodes */
export const NODE_FIELDS_DETAIL = [
    'id', 'name', 'shortName', 'start', 'end',
    { owners: [ 'id', 'name', { properties: ['name', 'value'] }, ] },
    { properties: ['name', 'value'] },
    { connectedOwners: ['name'] }
];

/** Query parameters for all detailed fields for links */
export const LINK_FIELDS_DETAIL = [
    'id', 'name', 'shortName', 'start', 'end',
    { nodeA: ['id', 'name', ] },
    { nodeB: ['id', 'name'] },
    { owners: ['id', 'name', { properties: ['name', 'value'] }] },
    { properties: ['name', 'value'] },
];

/** Query parameters for all detailed fields for institution */
export const INSTITUTION_FIELDS_DETAIL = [
  'id', 'name', 'shortName', 'latitude', 'longitude',
  { properties: ['name', 'value'] },
];

export const NODE_TYPE = 'NodeType';
export const LINK_TYPE = 'LinkType';
export const INSTITUTION_TYPE = 'InstitutionType';

export const NETWORK_ELEMENT_NAMES = {
  [NODE_TYPE]: $localize`nodes`,
  [LINK_TYPE]: $localize`links`,
  [INSTITUTION_TYPE]: $localize`institutions`
};
