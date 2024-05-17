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
 * This service provides functionality to send commands to the map from any other component.
 * The map implementation should listen to this service and respond accordingly.
 *
 * This service should NOT contain any references to types or information specific to the
 * map visualization library implementation. Doing so will increase the coupling between
 * the map component and other components, making this library dependant on the
 * visualization implementation.
 */

export interface LatLngBounds {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LINK_FIELDS_DETAIL, LINK_TYPE, NODE_FIELDS_DETAIL, NODE_TYPE } from 'src/constants';
import { DisplayService } from './display.service';
import { FilterService } from './filter.service';
import { QueryService } from './query.service';


@Injectable()
export class MapService {

  /** Emitted when the map should zoom to the specified lat/long coordinates */
  zoomBounds = new BehaviorSubject<LatLngBounds>({minLat: -90, minLng: -180, maxLat: 90, maxLng: 180});
  /** The target of what element the map is focused on */
  target = new BehaviorSubject<MapTarget>(null);

  constructor(
    private filterService: FilterService,
    private queryService: QueryService,
    private displayService: DisplayService
  ) { }

  /**
   * Sets the item the map is focused on
   */
  async setTarget(target: MapTarget) {
    if (!target) {
      this.displayService.hideDrawer();
      this.target.next(null);
      return;
    }
    try {
      switch (target.__typename) {
        case NODE_TYPE:
          this.displayService.displayLoadingDrawer();
          this.target.next(await this.queryService.getNode({ id: target.id }, NODE_FIELDS_DETAIL));
          this.displayService.displayNodeInfoDrawer();
          break;
        case LINK_TYPE:
          this.displayService.displayLoadingDrawer();
          this.target.next(await this.queryService.getLink({ id: target.id }, LINK_FIELDS_DETAIL));
          this.displayService.displayLinkInfoDrawer();
          break;
        default:
          console.warn(`Invalid target: ${(target as GraphQLType).__typename}`);
          this.target.next(null);
          this.displayService.hideDrawer();
      }
    } catch (err) {
      // TODO
      this.displayService.hideDrawer();
    }
  }

  /**
   * Adjusts the zoom to display all the nodes belonging to the owner
   * of the node that was received as a parameter.
   */
  zoomToSelectedOwner(selectedOwner: MapInstitution): void{
    /** All nodes for the selected owner */
    const nodesSelectedOwner = this.filterService.nodes.value.filter(node =>
      node.owners.some(owner => owner.id === selectedOwner.id)
    );

    const bounds = this.findBounds(nodesSelectedOwner);
    this.zoomBounds.next(bounds);
  }

  /**
   * Search for the highest and lowest latitudes and longitudes to define the boundaries
   * that encompass all the nodes that were received as a parameter.
   * Returns the bounds found.
   */
  private findBounds(nodes: MapNode[]) {
    let maxLat = -90;
    let maxLng = -180;
    let minLat = 90;
    let minLng = 180;

    nodes.forEach( node => {
      maxLat = Math.max(node.latitude, maxLat);
      maxLng = Math.max(node.longitude, maxLng);
      minLat = Math.min(node.latitude, minLat);
      minLng = Math.min(node.longitude, minLng);
    });

    return { maxLat, maxLng, minLat, minLng};
  }
}
