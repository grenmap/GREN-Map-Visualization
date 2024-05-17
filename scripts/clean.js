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
 * Cleans all unnecessary files from the dist directory,
 * including images and temporary unbundled js files.
 * 
 * 
 * If any files are generated and should not be deleted, add the name of
 * the file to the KEEP_FILES const list.
 */
const path = require('path');
const fs = require('fs');
const common = require(path.join(__dirname, 'common'));

function clean(languageCode) {
    /** joining path of directory */
    const directoryPath = common.localizedBundleDir(languageCode);

    /** List of files to keep in dist folder */
    const KEEP_FILES = [
        `gren-map.${languageCode}.js`,
        '3rdpartylicences.txt',
        'styles.css'
    ];

    //passing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        let output = '';
        //listing all files using forEach
        files.forEach((file)=>{
            if(!KEEP_FILES.includes(file)){
                fs.unlinkSync(path.join(directoryPath, file));  // nosemgrep : path-join-resolve-traversal
            }
        });
    });
}
common.LOCALES.forEach((l) => clean(l));
