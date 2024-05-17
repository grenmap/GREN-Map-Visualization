import * as L from 'leaflet';

type CSSStyleProperty = string | number | bigint;

export class GRENMapConfig {
    /** Element CSS Selector used to find the element to replace with the map */
    selector: string;
    /** Options for the tile provider */
    tileLayerOptions: L.TileLayerOptions;
    /** Options for the maps functionality */
    mapOptions: L.MapOptions;
    /** Leaflet tile provider URL */
    leafletTileURL: string;
    /** URL of remote graphql endpoint to use for visualization */
    endpointURL: string;
    /** Styles for links on the map */
    linkStyle: {
      /** CSS style properties */
      [label: string]: CSSStyleProperty;
      color: string;
    };
    /** Colors of links displayed on the map based on a given field */
    linkColorBasedOn: string;
    linkColorLabels: {
      /** Each label's value should represent a color in HTML, either #hex or named */
      [label: string]: string;
    };
    /** The name of the field to base the link color on */
    /** Style overrides for when the link is in hover state */
    linkHighlightStyle: {
      /** CSS style properties */
      [label: string]: CSSStyleProperty;
    };
    /** Style overrides for when the link has been selected */
    linkSelectedStyle: {
      /** CSS style properties */
      [label: string]: CSSStyleProperty;
    };
    /** Styles for nodes on the map */
    nodeStyle: {
      /** CSS style properties */
      [label: string]: CSSStyleProperty;
      color: string;
    };
    /** Colors of nodes displayed on the map based on a given field */
    nodeColorBasedOn: string;
    nodeColorLabels: {
      /** Each label's value should represent a color in HTML, either #hex or named */
      [label: string]: string;
    };
    /** The name of the field to base the node color on */
    /** Style overrides for when the node is in hover state */
    nodeHighlightStyle: {
      /** CSS style properties */
      [label: string]: CSSStyleProperty;
    };
    /** Style overrides for when the node has been selected */
    nodeSelectedStyle: {
      /** CSS style properties */
      [label: string]: CSSStyleProperty;
    };
    center?: {
      lat: number;
      lng: number;
    } | 'navigator';
    /** Options for filtering shown visuals */
    filtering?: {
      /** List of all node filters that can be shown. Not specifying denotes that all may be shown */
      allowedNodes?: string[];
      /** List of all link filters that can be shown. Not specifying denotes that all may be shown */
      allowedLinks?: string[];
    };
    /** Determines the default zoom level for the map */
    zoom?: number;
    /** Determines if the GREN logo should be shown */
    showLogo: boolean;
}
