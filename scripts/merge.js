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
 * Merges all js files in the dist directory into one unified bundle.
 */

// requiring path and fs modules
const path = require('path');
const fs = require('fs');
const common = require(path.join(__dirname, 'common'));

function merge(languageCode) {
    // Get absolute path of dist directory
    const directoryPath = common.localizedBundleDir(languageCode);

    // Get the list of files in the distribution directory
    let files = fs.readdirSync(directoryPath);
    let output = '';
    for(let file of files){
        // If the file is a js file, add it to the combinations
        if(file.indexOf('.js') !== -1){
            output += fs.readFileSync(path.join(directoryPath, file)) + '\n';
        }
    }

    fs.writeFileSync(path.join(directoryPath, `gren-map.${languageCode}.js`), output);
}

common.LOCALES.forEach((l) => merge(l));
