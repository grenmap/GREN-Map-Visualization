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
import { Component, AfterViewInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import * as L from 'leaflet';
import { MapService } from 'src/services/map.service';
import { PositionService } from 'src/services/position.service';
import { LINK_TYPE, NODE_TYPE } from 'src/constants';
import { GRENMapConfig } from 'src/typings/config';
import { DisplayService } from 'src/services/display.service';
import { FilterService } from 'src/services/filter.service';
import { QueryService } from 'src/services/query.service';
import { Subscription } from 'rxjs';

type Selected = {
  layer: L.CircleMarker | L.Polyline;
  style: object;
  selectedStyle: object;
};

// z-index for Node Pane and Link Pane.
// The z-index property specifies the stack order of an element. An element
// with greater stack order is always in front of an element with a lower
// stack order. The z-index is 600 for leaflet-marker-pane, 650 for
// leaflet-tooltip-pane so we choose values between them for node and link.
const NODE_PANE_ZINDEX = '620';
const LINK_PANE_ZINDEX = '610';

/**
 * This component handles drawing nodes and links on a leaflet map.
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') private map: L.Map;

  /** All subscriptions created in the module that should be destroyed */
  private subscriptions = [] as Subscription[];

  /** Caches information about the current target to allow for restoring styles after is de-selected */
  private selected: Selected;

  // Any layers drawn due to getting data should be stored in these objects so that
  // it can be automatically cleaned up when the data changes
  private nodeLayerGroup: L.FeatureGroup = L.featureGroup([]);
  private linkLayerGroup: L.FeatureGroup = L.featureGroup([]);
  private institutionLayerGroup: L.FeatureGroup = L.featureGroup([]);

  constructor(
    public config: GRENMapConfig,
    private mapService: MapService,
    private positionService: PositionService,
    private displayService: DisplayService,
    public queryService: QueryService,
    filterService: FilterService

  ) {
    this.subscriptions.push(
      filterService.nodes.subscribe(nodes => this.nodes = nodes),
      filterService.links.subscribe(links => this.links = links),
      mapService.target.subscribe(target => { this.selected?.layer?.setStyle(this.selected.style); })
    );
  }

  /** Cleans up any resources or events for the component */
  ngOnDestroy(): void {
    // Destroy all subscriptions to clean up
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // Passthrough for getting the target more easily
  get target() { return this.mapService.target.value; }

  /**
   * Handles drawing the nodes on the map.
   * Don't assume that the owners will have any data other than id.
   * To get additional information about owners, get the data from the
   * query service.
   */
  set nodes(nodes: Readonly<MapNode>[]) {
    // Clean up any previous points.
    this.nodeLayerGroup.clearLayers();

    // Grab current config once to shorten code in the rest of this method
    const config = this.config;
    // Add the new points
    for (const node of nodes) {
      if (!node.latitude) {
        console.warn(`Latitude not provided for node with id ${node.id}`);
      } else if (!node.longitude) {
        console.warn(`Longitude not provided for node with id ${node.id}`);
      } else {
        const relevantProperties = node.properties[config.nodeColorBasedOn] || [];
        // Gets the color ofthe node based on the properties, defaulting to the value set in config
        const nodeColor = this.mapPropertyToStyleValue(
          relevantProperties, config.nodeColorLabels, true,
        ) || config.nodeStyle.color;
        // Use the general configured value as a base,
        // and apply colors based on each node's properties
        const nodeStyle = { ...config.nodeStyle, color: nodeColor, fillColor: nodeColor };
        // Highlight styles (and selected styles below) are based on the static styles and merged in
        const nodeHighlightStyle = { ...nodeStyle, ...config.nodeHighlightStyle };
        nodeHighlightStyle.fillColor = nodeHighlightStyle.color;
        const layer = L.circleMarker([node.latitude, node.longitude], nodeStyle);
        layer.bindTooltip(node.name);
        layer.on({
          click: () => {
            if (this.target?.id === node.id) {
              this.selected?.layer?.setStyle(this.selected.style);
              this.mapService.setTarget(null);
            } else {
              this.selected?.layer?.setStyle(this.selected.style);
              this.mapService.setTarget(node);
              const nodeSelectedStyle = { ...nodeStyle, ...config.nodeSelectedStyle };
              nodeSelectedStyle.fillColor = nodeSelectedStyle.color;
              this.selected = { layer, style: nodeStyle, selectedStyle: nodeSelectedStyle };
              layer.bringToFront();
              layer.setStyle(nodeSelectedStyle);
            }
          },
          mouseover: () => {
            layer.setStyle(nodeHighlightStyle);
          },
          mouseout: () => {
            if (node === this.target) {
              layer.setStyle(this.selected.selectedStyle);
            } else {
              layer.setStyle(nodeStyle);
            }
          }
        });
        this.nodeLayerGroup.addLayer(layer).addTo(this.map);
      }
    }
  }

  /**
   * Handles drawing the links on the map.
   * Don't assume that the nodes that are at the endpoints will have
   * any data other than latitude, longitude and id.
   * Additionally, the owners of the link will only contain id's, and nothing more.
   * To get additional information about owners or nodes, get the data from the
   * query service.
   */
  set links(links: Readonly<MapLink>[]) {

    // Clean up any previous points
    this.linkLayerGroup.clearLayers();

    // Grab current config once to shorten code in the rest of this method
    const config = this.config;

    // Add the new points
    for (const link of links) {
      // Make sure the endpoints are valid before attempting to draw links.
      // In theory this should never happen, but this helps debug when it does.
      if (!link.nodeA.latitude) {
        console.warn(`Node A latitude not provided for link with id ${link.nodeA.id}`);
      } else if (!link.nodeA.longitude) {
        console.warn(`Node A longitude not provided for link with id ${link.nodeA.id}`);
      } else if (!link.nodeB.latitude) {
        console.warn(`Node B latitude not provided for link with id ${link.nodeB.id}`);
      } else if (!link.nodeB.longitude) {
        console.warn(`Node B longitude not provided for link with id ${link.nodeB.id}`);
      } else {
        // Default link color in case something goes wrong later.
        let linkColor = config.linkStyle.color;
        try {
          const relevantProperties = link.properties[config.linkColorBasedOn] || [];
          linkColor = this.mapPropertyToStyleValue(
            relevantProperties,
            config.linkColorLabels,
            true,
          ) || config.linkStyle.color;
        } catch (err) {
          console.error(err);
        }
        const linkStyle = { ...config.linkStyle, color: linkColor };
        const linkHighlightStyle = { ...linkStyle, ...config.linkHighlightStyle};
        const layer = L.polyline([
          [link.nodeA.latitude, link.nodeA.longitude],
          [link.nodeB.latitude, link.nodeB.longitude]
        ], linkStyle);
        layer.bindTooltip(link.name);
        layer.on({
          click: () => {
            if (this.target?.id === link.id) {
              this.selected?.layer?.setStyle(this.selected.style);
              this.mapService.setTarget(null);
            } else {
              this.selected?.layer?.setStyle(this.selected.style);
              this.mapService.setTarget(link);
              const linkSelectedStyle = { ...linkStyle, ...config.linkSelectedStyle};
              this.selected = { layer, style: linkStyle, selectedStyle: linkSelectedStyle };
              layer.bringToFront();
              layer.setStyle(linkSelectedStyle);
            }
          },
          mouseover: () => {
            layer.setStyle(linkHighlightStyle);
          },
          mouseout: () => {
            if (link === this.target) {
              layer.setStyle(this.selected.selectedStyle);
            } else {
              layer.setStyle(linkStyle);
            }
          }
        });
        this.linkLayerGroup.addLayer(layer).addTo(this.map);
      }
    }
  }

  /**
   * A callback method that is invoked immediately after
   * Angular has completed initialization of a component's view.
   * It is invoked only once when the view is instantiated.
   */
  ngAfterViewInit(): void {
    // Create a new map instance for the component
    this.map = L.map('map', this.config.mapOptions);
    // Add a zoom control to the bottom left of the map
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
    // Get tiles layer with custom configuration
    const tiles = L.tileLayer(this.config.leafletTileURL, this.config.tileLayerOptions);
    // Add the tiles layer to the map
    tiles.addTo(this.map);
    // Positions the map based on remote configuration
    this.applyInitialViewPosition();
    // Poke map to fix the tiles not loading if the map loads too quickly
    setTimeout(() => { this.map.invalidateSize(); }, 1000);
    // Create the pane for nodes and links to allow drawing each set independently
    this.map.createPane('nodeMarker');
    this.map.createPane('linkMarker');
    this.map.getPane('nodeMarker').style.zIndex = NODE_PANE_ZINDEX;
    this.map.getPane('linkMarker').style.zIndex = LINK_PANE_ZINDEX;

    this.map.on({
      mousemove: () => {
        const typesThatChangeStyle = [NODE_TYPE, LINK_TYPE];
        let changeStyleForCurrentTarget = false;
        if (this.target) {
          changeStyleForCurrentTarget =
            typesThatChangeStyle.indexOf(this.target.__typename) !== -1;
        }

        if (changeStyleForCurrentTarget) {
          this.selected?.layer.setStyle(this.selected.selectedStyle);
        }
      }
    });
    this.map.whenReady(() => {
      // React to map zoom requests
      this.subscriptions.push(
        this.mapService.zoomBounds.subscribe(bounds => {
          if (!bounds) { return; }
          // If the bounds is just a single point
          if (bounds.minLat === bounds.maxLat && bounds.minLng === bounds.maxLng) {
            this.map.flyTo([bounds.minLat, bounds.minLng], 8);
          }
          else {
            this.map.flyToBounds([[bounds.minLat, bounds.minLng], [bounds.maxLat, bounds.maxLng]], {padding: [10, 10]});
          }
        })
      );
    });
  }

  /** Opens the REN drawer if it is closed, otherwise closes it */
  public onRENBtnClick() {
    if (this.displayService.openDrawerType.value === 'RensInfo') {
      this.displayService.hideDrawer();
    } else {
      this.selected = null;
      this.displayService.displayRensInfoDrawer();
    }
  }

  /**
   * When the PositionService is ready, retrieves the viewport center and zoom,
   * and sets Leaflet to these initial values.
   */
  private async applyInitialViewPosition() {
    try {
      await this.positionService.getInitialViewPosition();
      const latlng = L.latLng(this.positionService.center.lat, this.positionService.center.lng);
      try {
        this.map.setView(latlng, this.positionService.zoom);
      } catch (err) {
        console.warn('View position setting failed.');
        console.error(err);
      }
    } catch (err) {
      console.warn('View position retrieval failed.');
      console.error(err);
    }
  }

  /**
   * Chose the first/last entry in propertyToStyleValueMap where the key exists in propertyValues.
   * The order of matching is browser-dependent, but most implementations retain insertion order.
   * Undefined is returned if no matches are found.
   * @param propertyValues - An array of string values, usually values of property keys
   * @param propertyToStyleValueMap - A key-val mapping from matching property values
   *   from propertyValues to style strings such as colors
   * @param reverse - Match the first (false, default) or last (true) found key.
   */
  mapPropertyToStyleValue(
    propertyValues: string[],
    propertyToStyleValueMap: object,
    reverse = false
  ): string | undefined {
    try {
      let mapKeys = Object.keys(propertyToStyleValueMap);
      if (reverse) { mapKeys = mapKeys.reverse(); }
      const matchingKey: string | undefined = mapKeys.find(key => propertyValues.includes(key));
      return matchingKey === undefined ? undefined : propertyToStyleValueMap[matchingKey];
    } catch (err) {
      return undefined;
    }
  }
}
