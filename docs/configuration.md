# Configuring the Visualization Instance

Default visualization configuration parameters are provided in src/config.ts .
These are bundled into the Javascript package and should not be changed
directly.

To change any of these parameters for a visualization instance, provide an
object containing the desired keys and values as the second parameter when
calling G.map, as follows:

```javascript
var config = {

  mapOptions: {
      zoom: 4,
      center: [45.4215, -75.6972],
  },

  endpointURL: 'http://gren.org:80/map/',

  linkDefaultColor: 'orange',

  linkColorLabels: {
    submarine: '#b41918',
    'magic': 'yellow'
  }

};

window.G.map('[map]', config);
```

## Configuration Parameters

The following is a list of the permitted keys and their expected types.

### Data Source

The URL for the GREN Map database instance that provides the network map data
for this visualization:

```javascript
endpointURL: 'http://localhost:80/',
```

### Tiles

Tiles define how the base map looks, including colors, topographical shading,
geopolitical names (countries, cities, etc.).  Tiles are pre-generated.
The URL for the pre-generated tiles:

```javascript
leafletTileURL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
```

The tiles may be somewhat further configured:

```javascript
tileLayerOptions: {
    noWrap: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
},
```

Note that often attribution is required for tile sets found in public libraries.

### Map Zoom & Pan

Set the default zoom and bounds for the map view, and control dynamic maximums
and minimums for zooming.

```javascript
mapOptions: {
    zoom: 3,
    center: [39.8282, -98.5795],
    maxBounds: [[90, -180], [-90, 180]],
    minZoom: 2,
    maxZoom: 12,
    zoomControl: false
},
```

### Node & Link Colors

Colors may be specified as named (e.g. "red") or HTML hex (e.g. "#FF0000").

#### Nodes

Default styles for all nodes (dots):
(Note that the "fillColor" style is overridden by "color".)

```javascript
nodeStyle: {
  color: 'grey',
  fillOpacity: 1,
  radius: 5,
  pane: 'nodeMarker',
},
```

Colors may be applied on top of the default based on a specified property:

```javascript
nodeColorBasedOn: 'types',
```

The values of the property above are checked against the keys in the following map.
A match results in the color value being applied to the node.
The last (lowest/latest) key defined here takes precedence when there are multiple matches.

```javascript
nodeColorLabels: {
  PREN: '#2a2d7c',
  NREN: '#575d94',
  SREN: '#979dba',
},
```

Styles that are applied over top of the defaults when the user hovers over a node:

```javascript
nodeHighlightStyle: {
  color: '#d97b41',
  fillOpacity: 1,
  radius: 10
},
```

Styles that are applied over top of the defaults when the user has selected a node:

```javascript
nodeSelectedStyle: {
  color: '#d94141',
  fillOpacity: 1,
  radius: 8,
},
```

#### Links

Default styles for all links (lines):

```javascript
linkStyle: {
  color: 'grey',
  weight: 2,
  pane: 'linkMarker',
},
```

Colors may be applied on top of the default based on a specified property:

```javascript
linkColorBasedOn: 'types',
```

The values of the property above are checked against the keys in the following map.
A match results in the color value being applied to the link.
The last (lowest/latest) key defined here takes precedence when there are multiple matches.

```javascript
linkColorLabels: {
  PREN: '#2a2d7c',
  NREN: '#575d94',
  SREN: '#979dba',
  International: '#4f1427',
},
```

Styles that are applied over top of the defaults when the user hovers over a link:

```javascript
linkHighlightStyle: {
  color: '#d97b41',
  weight: 4,
},
```

Styles that are applied over top of the defaults when the user has selected a link:

```javascript
linkSelectedStyle: {
  color: '#d94141',
  weight: 3,
},
```

### GREN Map Logo

To show the GREN Map logo or not:

```javascript
showLogo: true,
```

### Filtering

Filtering the maps nodes and links by tag can be controlled with the following attribute:

```javascript
filtering: {
    allowedNodes: ["Core"],
    allowedLinks: ["Core"],
}
```

Providing values for allowedNodes will restrict the tag for filtering to the list provided for the
respective setting. Adding values to the "allowedNodes" will add that filter value to the map
interface for filtering for nodes that have tag with that value.

Leaving these values empty will default to allowing filtering on all tag values that appear.

A value will only show in the interface when it's been added to an allowlist if it also appears
as a tag value on the element.