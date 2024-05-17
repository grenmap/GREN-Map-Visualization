# Bundling

Bundling the project happens in multiple steps. This document covers the requirements of bundling,
as well as the prerequisites.

## Prerequisites

Bundling reduces the outputted files down to the minimum number(a js file and a css file).
In order to do this, the project should not use any assets that are not embedded in the project.
Images should be avoided, although svg's can be used as long as they are a part of the
template. CSS files from outside libraries should be included via the 'styles' array
in the 'angular.json' file.

## Build

Building generates multiple js files, providing polyfills for older browsers.
Unfortunately, this step doesn't allow for renaming the output
files.

## Merge

This step takes all of the specified javascript files and combines them together
into one file named 'gren-map.js'.

## Clean

This final step removes any files that should not be distributed, aside from the example index
file. To keep any additional files, add them to the list in the script file.