/// <reference types="@angular/localize" />

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
 */
/* eslint-disable @typescript-eslint/no-empty-interface */
// import { enableProdMode } from '@angular/core';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import {AppModule} from './modules/app.module';
import { environment } from './environments/environment';
import { GRENMapConfig } from './typings/config';
import * as deepmerge from 'deepmerge';
import { configDefaults } from './config';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './modules/app.module';


declare global {
  var G: GRENMapAPI;
  interface Window { G: GRENMapAPI; }
}

/** Functions for manupulating the map during runtime (WIP) */
interface MapController { }

class GRENMapAPI {

  /**
   * Creates a map where the location of the provided css selector is
   * @param configOverrides - Overrides for dynamic map customization
   */
  map(configOverrides: Partial<GRENMapConfig>): MapController {
    // if (environment.production) { enableProdMode(); }
    /** Copy of default configuration used for the map */
    let config: GRENMapConfig = {...configDefaults};
    try {
      // Merges the environment-based configuration first
      config = deepmerge(config, environment.config);
      // Merges custom configuration from user
      config = deepmerge(config, configOverrides || {});
      // Freezes the config to prevent modifications to it after.
      // If we would like to allow for modifying the config at runtime, we need
      // to implement a pub/sub mechanism to ensure that the components update
      // when the config is changed.
      config = Object.freeze(config);
    } catch (e) {
      console.error('Error initializing GREN Map configuration:');
      console.error(e);
    }
    platformBrowserDynamic([
      { provide: GRENMapConfig, useValue: config }
    ]).bootstrapModule(AppModule, {})
      .catch(err => console.error(err));

    // Change this object to expose API when the map is created
    return {};
  }
}

window.G = new GRENMapAPI();

// Export the API so it can be used by other frameworks to bootstrap easily while still having typing support
export default G;
