/**
 * Copyright 2021 RNP
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
 * Service for retrieving data regarding initial map positioning
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GRENMapConfig } from 'src/typings/config';

// URL paths for intial view position endpoints
const INITIAL_COORDS_ENDPOINT = 'visualization/initial_coordinates/';
const INITIAL_ZOOM_ENDPOINT = 'visualization/initial_zoom/';
const DEFAULT_ZOOM_LEVEL = 3;
const DEFAULT_CENTER_COORDINATES = {lat: 0, lng: 0};  // Null Island

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  // Default relative URLs for the position endpoints; these will be overridden in the constructor
  initialDBCoordinatesUrl = `/${INITIAL_COORDS_ENDPOINT}`;
  initialDBZoomUrl = `/${INITIAL_ZOOM_ENDPOINT}`;
  zoom = DEFAULT_ZOOM_LEVEL;
  center = DEFAULT_CENTER_COORDINATES;
  ready: Promise<void[]> | null = null;

  constructor(
    private http: HttpClient,
    private config: GRENMapConfig
  ) {
    this.initialDBCoordinatesUrl = `${this.config.endpointURL}${INITIAL_COORDS_ENDPOINT}`;
    this.initialDBZoomUrl = `${this.config.endpointURL}${INITIAL_ZOOM_ENDPOINT}`;
  }

  /**
   * Gets the coordinates the map should focus on when initially loaded
   * Initial zoom is set based on the following priority order:
   *  - set in Config parameter 'center' where the map is instantiated
   *    - if the parameter is set to 'navigator', the browser's published location
   *  - fetched from the source database in the setting GREN_MAP_INITIAL_COORDINATES
   *  - DEFAULT_CENTER_COORDINATES
   */
  private async getInitialCoordinates(): Promise<void> {
    if (this.config.center) {
      if (this.config.center === 'navigator') {
        try {
          const position = this.getNavigatorLocation();
          this.setCenterFromGeolocationPosition(position);
        } catch (err) {
          this.setDefaultCenter();
        }
      } else {
        try {
          this.setCenter(this.config.center);
        } catch (err) {
          this.setDefaultCenter();
        }
      }
    } else {
        try {
          const coords = await this.http.get<{lat: number; lng: number}>(`${this.initialDBCoordinatesUrl}`).toPromise();
          this.setCenter(coords);
        } catch (err) {
          this.setDefaultCenter();
        }
    }
  }

  // Below are a set of helper functions to reduce duplication in the callbacks above
  private setCenter(coords: {lat: number, lng: number}) {
    this.center = coords;
  }

  private setCenterFromGeolocationPosition(position) {
    const positionCenter = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    this.setCenter(positionCenter);
  }

  private setDefaultCenter() {
    this.center = DEFAULT_CENTER_COORDINATES;
  }

  /**
   * Gets the initial zoom level of the map
   * Initial zoom is set based on the following priority order:
   *  - set in Config parameter 'zoom' where the map is instantiated
   *  - fetched from the source database in the setting GREN_MAP_INITIAL_ZOOM
   *  - DEFAULT_ZOOM_LEVEL
   */
  private async getInitialZoom(): Promise<void> {
    if (this.config.zoom) {
      try {
        this.setZoom(this.config.zoom);
      } catch (err) {
        this.setDefaultZoom();
      }
    } else {
        try {
          const zoomObject = await this.http.get<{zoom: number}>(`${this.initialDBZoomUrl}`).toPromise();
          this.setZoomFromObject(zoomObject);
        } catch (err) {
          this.setDefaultZoom();
        }
    }
  }

  // Below are a set of helper functions to reduce duplication in the callbacks above
  private setZoom(zoomLevel) {
    this.zoom = zoomLevel;
  }

  private setZoomFromObject(zoomObject) {
    this.setZoom(zoomObject.zoom);
  }

  private setDefaultZoom() {
    this.zoom = DEFAULT_ZOOM_LEVEL;
  }

  private getNavigatorLocation(): Promise<GeolocationPosition> {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    } else {
      console.warn('Navigator does not support geolocation');
      throw new Error($localize`Navigator does not support geolocation`);
    }
  }
  /**
   * If it hasn't yet been done, kicks off initial fetching of co-ordinates and zoom levels.
   * If it has, it doesn't start the fetching again.
   * @returns Either way, a joint Promise (encompassing all of the fetches) is returned
   */
  getInitialViewPosition() {
    if (this.ready !== null) { return this.ready; }
    try {
      this.ready = Promise.all([
        this.getInitialCoordinates(),
        this.getInitialZoom(),
      ]);
      return this.ready;
    } catch (err) { throw err; }
  }

}
