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
 * This file contains default application configuration options to allow
 * for changing the visualization's behaviour, logic, and appearance.
 * These values may be overridden upon instantiation of the map by providing
 * an object with the desired overrides as the second parameter.
 */
/* eslint-disable max-len */

import { GRENMapConfig } from './typings/config';


// If the signature of this object is changed, reminder to update docs/configuration.md
export const configDefaults: GRENMapConfig = {
    selector: '[map]',
    tileLayerOptions: {
        noWrap: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    mapOptions: {
        zoom: 3,
        center: [39.8282, -98.5795],
        maxBounds: [[90, -180], [-90, 180]],
        minZoom: 3,
        maxZoom: 18,
        zoomSnap: 0.25,
        zoomControl: false
    },
    leafletTileURL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    endpointURL: '/',

    /** Basic link style */
    linkStyle: {
      color: 'grey',
      weight: 2,
      pane: 'linkMarker',
    },

    /** Colors of links displayed on the map based on a given field */
    linkColorBasedOn: 'tag',
    linkColorLabels: {
      // Multiple matches have reverse priority: entries added lower/later have higher precedence
      PREN: '#1e8f9c',
      NREN: '#2a2d7c',
      SREN: '#744496',
      International: '#239e58',
    },

    /** Link hover style overrides */
    linkHighlightStyle: {
      color: '#d97b41',
      weight: 4,
    },

    /** Link selected style overrides */
    linkSelectedStyle: {
      color: '#d94141',
      weight: 3,
    },

    /** Basic node style */
    nodeStyle: {
      color: 'grey',
      fillOpacity: 1,
      radius: 5,
      pane: 'nodeMarker',
    },

    /** Colors of nodes displayed on the map based on a given field */
    nodeColorBasedOn: 'tag',
    nodeColorLabels: {
      // Multiple matches have reverse priority: entries added lower/later have higher precedence
      PREN: '#1e8f9c',
      NREN: '#2a2d7c',
      SREN: '#744496',
    },

    /** Node hover style overrides */
    nodeHighlightStyle: {
      color: '#d97b41',
      fillOpacity: 1,
      radius: 10
    },

    /** Node selected style overrides */
    nodeSelectedStyle: {
      color: '#d94141',
      fillOpacity: 1,
      radius: 8,
    },

    showLogo: true,
};
