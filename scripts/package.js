/**
 * Copyright 2020 GRENMap Authors.
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
 * Generates a package.json for the distribution js file for the visualization
 */
const path = require('path');
const fs = require('fs');

const DIST_DIRECTORY = '../dist/gren-map-visualization/';

// Read the original package.json file
let originalPackage = require('../package.json');

/** Slim package with minimal data from the original package */
let newPackage = {
    name: originalPackage.name,
    version: originalPackage.version,
    private: originalPackage.private || false,
    description: originalPackage.description || ''
}

/** Write out to the distibuted package.json */
fs.writeFileSync(path.join(__dirname, `${DIST_DIRECTORY}package.json`), JSON.stringify(newPackage));
