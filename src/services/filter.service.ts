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
 * This service handles loading data from graphql and filtering it, as well as
 * collecting information about various datasets that may be useful accross the application
 */

import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GRENMapConfig } from 'src/typings/config';
import { QueryService } from './query.service';
import { LINK_TYPE, NODE_TYPE } from 'src/constants';

const INITIAL_NODE_FILTER = { properties: {} };
const INITIAL_LINK_FILTER = { properties: {} };
const INITIAL_INSTITUTION_FILTER = { };

const INITIAL_COMBINED_FILTER = [
  {element: NODE_TYPE as NetworkElement, property: '', filters: {}},
  {element: LINK_TYPE as NetworkElement, property: '', filters: {}}
];



/**
 * This function takes an array of network elements and a filter object,
 * which maps properties to booleans. The result is the subset of the
 * network elements determined by the filter.
 *
 * The subset contains those elements in the input array in which at least
 * one of properties that the filter object associates to true is present.
 */
export function filterElements(
    elements: Readonly<MapNode | MapLink>[],
    filterObject: MapNodeFilter | MapLinkFilter
) {
    // Copy list of element references to be filtered
    let filteredElements = elements;

    // Filters out all elements that don't have property values matching the parameters
    if (Object.entries(filterObject.properties).some(([prop, values]) => Object.values(values).some(v => v))) {
        filteredElements = filteredElements.filter(element => {
            // Loop through the properties of the filter set until one matches with the element
            return Object.entries(filterObject.properties).some(([key, values]) => {
                // If the property does not exist in the element, skip checking
                if (!element.properties[key]) { return false; }
                // If a match is found for a property name, check if any of the values match
                // the filter parameter value
                return Object.entries(values).some(([value, filter]) => filter && element.properties[key].includes(value));
            });
        });
    }

    return filteredElements;
}

/**
 * This function populates a combined filter object that has properties
 * from nodes and links.
 *
 * The combined filter re-arranges the properties selected by the user
 * into a format suitable for consumption in the filter component
 * (src/components/filter).
 *
 * Suppose there are E types of elements (nodes and links for example)
 * and each type has P types of properties. The value returned by this
 * method will be an array of E * P items. Each will be an object with
 * the following attributes: "element" is the type of network element;
 * "property" is the property type (e.g. tag) and filters is the object
 * that maps property names to boolean values.
 */
export function updateCombinedFilter(
    nodeFilterObject: MapNodeFilter,
    linkFilterObject: MapLinkFilter
) {
    function flattenProps(
        elementName: NetworkElement,
        properties: Record<string, Record<string, boolean>>
    ) {
        return Object.keys(properties).map((key) => {
            return {
                element: elementName,
                property: key,
                filters: properties[key]
            };
        });
    }

    const nodeProps = flattenProps(NODE_TYPE, nodeFilterObject.properties);
    const linkProps = flattenProps(LINK_TYPE, linkFilterObject.properties);
    return nodeProps.concat(linkProps);
}

@Injectable()
export class FilterService implements OnDestroy {

    /** List of all subscriptions for the service to destroy when it is cleaned up */
    private subscriptions = [] as Subscription[];

    /** Filter applied to nodes that are published from this service */
    nodeFilter = new BehaviorSubject<MapNodeFilter>(INITIAL_NODE_FILTER);
    /** Filter applied to links that are published from this service */
    linkFilter = new BehaviorSubject<MapLinkFilter>(INITIAL_LINK_FILTER);
    /** Filter applied to links that are published from this service */
    institutionFilter = new BehaviorSubject<MapInstitutionFilter>(INITIAL_INSTITUTION_FILTER);

    /** All nodes currently displayed on the map after filtering is applied */
    nodes = new BehaviorSubject<Readonly<MapNode>[]>([]);
    /** All links currently displayed on the map after filtering is applied */
    links = new BehaviorSubject<Readonly<MapLink>[]>([]);
    /** All institutions currently displayed on the map after filtering is applied */
    institutions = new BehaviorSubject<Readonly<MapInstitution>[]>([]);
    /** Selected properties of nodes and links */
    combinedFilter = new BehaviorSubject<CombinedFilter>(INITIAL_COMBINED_FILTER);

    constructor(queryService: QueryService, public config: GRENMapConfig) {

        // Subscribe to the output of the query service to allow for immediate filtering
        this.subscriptions.push(
            // When the query service updates, collect the relevent filter information
            queryService.nodes.subscribe(nodes => this.collectNodeFilterData(nodes)),
            queryService.links.subscribe(links => this.collectLinkFilterData(links)),
            queryService.institutions.subscribe(institutions => this.collectInstitutionFilterData(institutions)),
            // When filters change, perform filtering on query data.
            // This is also indirectly triggered by the above steps
            this.nodeFilter.subscribe(() => this.filterNodes(queryService.nodes.value)),
            this.linkFilter.subscribe(() => this.filterLinks(queryService.links.value)),
            this.institutionFilter.subscribe(() => this.filterInstitutions(queryService.institutions.value)),
        );
    }

    /**
     * Cleans up any remaining resources.
     * In theory we should never see a webpage outlive the service
     * with the expected use cases, but this is a good precaution.
     */
    ngOnDestroy() { this.subscriptions.forEach(sub => sub.unsubscribe()); }

    /**
     * This function creates a filter object by checking for a configured allowlist
     * for nodes and links, and then defaulting to a collection method if no allowlist is
     * specified.
     *
     */
    createFilterObject(
        elements: Readonly<MapNode | MapLink>[],
        filterObject: MapNodeFilter | MapLinkFilter
    ) {
        const properties = {} as Record<string, Record<string, boolean>>;
        /** List of properties that are to be shown */
        let allowList = undefined as string[];
        // If an allowed nodes or links list is specified, set it as the allowlist
        if (elements[0]?.__typename === NODE_TYPE) {
            allowList = this.config.filtering?.allowedNodes;
        } else if (elements[0]?.__typename === LINK_TYPE) {
            allowList = this.config.filtering?.allowedLinks;
        }
        // If an allowlist is specified, don't bother with the collection
        if (allowList) {
            properties.tag = {};
            for (const tag of allowList) {
                // If the value was already set, copy it
                properties.tag[tag] = false || !!filterObject.properties?.tag?.[tag];
            }
            return properties;
        }

        // Return the collected properties ordered by frequency of occurance
        return this.collectOrderedFilterFromElements(elements, filterObject);
    }

    /**
     * This function creates a filter object by collecting the properties
     * in the network elements it receives as an argument.
     *
     * Each element may have a "properties" attribute. This is an object
     * that associates a name (a kind or type of property), to a list of names,
     * (the properties of the type indicated that the element possesses).
     *
     * Example of a node's properties attribute:
     * {"tag": ["Core link", "NREN"]}
     *
     * The filter object will have as many attributes as the number
     * of property types found in the elements. The value of each attribute
     * will be an object that maps the name found in the list of names
     * to a false boolean value.
     *
     * The filter will be ordered by frequency of occurance in the elements for the order
     * of the elements in the map. Since the properties of objects in javascript
     * are ordered by insertion, the order is preserved when using methods such as "keys"
     * or "entries".
     *
     * Example:
     * {"properties": {"tag": {"Core link": false, "NREN": false}}}
     *                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     *                The filter object is actually the one associated
     *                to the "properties" key.
     *
     * In the future we may wish to replace this process with a one-time call to the server to
     * get a single list of all filter values from which we can use to filter the visualization.
     */
    private collectOrderedFilterFromElements(
        elements: Readonly<MapNode | MapLink>[],
        filterObject: MapNodeFilter | MapLinkFilter
    ) {
        let properties = {} as Record<string, Record<string, boolean>>;
        // Loop through all of the locally known elements
        for (const element of elements) {
            if (!element.properties) { continue; }
            // Loop through all the properties of the element
            for (const [name, values] of Object.entries(element.properties)) {
                // Create the entry for the property name
                if (properties[name] === undefined) { properties[name] = {}; }
                /** Map of property name to number of times it occurs */
                const propertyOccurances = {} as Record<string, number>;
                // Add all of the values to the record
                for (const value of values) {
                    // Keep the value if it's already been set
                    properties[name][value] = false || !!filterObject[name]?.[value];
                    // Count the number of times the property occurs
                    propertyOccurances[value] = propertyOccurances[value] ? propertyOccurances[value]++ : 0;
                }
                // Now sort by number of occurances.
                // This works by using the name of the property to compare the counts that
                // were kept by the previous step, and sorting in place
                const sortedProps = Object.entries(properties[name]).sort(
                    (a, b) => propertyOccurances[a[0]] - propertyOccurances[b[0]]
                );
                // Lastly, assign to the properties based on the new sorted values
                properties[name] = {};
                for (const [pname, value] of sortedProps) {
                    properties[name][pname] = value;
                }
            }
        }
        // Temporary override to only show tags
        // TODO replace this with a better mechanism
        const tags = properties.tag;
        properties = { };
        if (tags) { properties.tag = tags; }

        return properties;
    }

    /** Creates a new filter object and assigns it to the given elementFilter  */
    private collectFilterData(
        elements: Readonly<MapNode | MapLink>[],
        elementFilter: BehaviorSubject<MapNodeFilter | MapLinkFilter>
    ) {
        const properties = this.createFilterObject(elements, elementFilter.value);

        // Publish changed filter to update the ui and filtering
        elementFilter.next({properties});

        // Assign the union of node and link properties to the combined filter
        if (this.nodeFilter && this.linkFilter) {
            this.combinedFilter.next(
                updateCombinedFilter(this.nodeFilter.value, this.linkFilter.value)
            );
        }
    }

    /**
     * Collects all of the information needed to perform filtering
     * on the current data set of nodes
     */
    private collectNodeFilterData(nodes: Readonly<MapNode>[]) {
        this.collectFilterData(nodes, this.nodeFilter);
    }

    /**
     * Collects all of the information needed to perform filtering
     * on the current data set of links
     */
    private collectLinkFilterData(links: Readonly<MapLink>[]) {
        this.collectFilterData(links, this.linkFilter);
    }

    /**
     * Collects all of the information needed to perform filtering
     * on the current data set of institutions
     */
    private collectInstitutionFilterData(institutions: Readonly<MapInstitution>[]) {
        this.institutionFilter.next({});
    }

    /**
     * This step takes the data that was loaded in and retrieves the information
     * necessary to provide filtering capabilities for nodes, as well as applying
     * the filtering
     */
    private filterNodes(nodes: Readonly<MapNode>[]) {
        const filteredNodes = filterElements(nodes, this.nodeFilter.value);
        this.nodes.next(filteredNodes as Readonly<MapNode>[]);
    }

    /**
     * Filter links according to the attributes selected by the user.
     * The argument is an array containing the links shown in the map.
     */
    private filterLinks(links: Readonly<MapLink>[]) {
        const filteredLinks = filterElements(links, this.linkFilter.value);
        this.links.next(filteredLinks as Readonly<MapLink>[]);
    }

    /**
     * Unimplemented scaffolding for filtering institutions
     */
    private filterInstitutions(institutions: Readonly<MapInstitution>[]) {
        this.institutions.next(institutions);
    }

    /** Clears all selections in the given filter */
    resetFilter(filterObservable: BehaviorSubject<MapNodeFilter | MapLinkFilter>) {
        const filterValue = filterObservable.value;
        // Loop through all properties and values and set filter to false
        for (const [key, value] of Object.entries(filterValue.properties)) {
            for (const valueKey of Object.keys(value)) {
                filterValue.properties[key][valueKey] = false;
            }
        }
        filterObservable.next(filterValue);
    }
    /** Resets the filter on the displayed nodes and updates the map */
    resetNodeFilter() {
        this.resetFilter(this.nodeFilter);
    }
    /** Resets the filter on the displayed links and updates the map */
    resetLinkFilter() {
        this.resetFilter(this.linkFilter);
    }
    /** Resets the filter on the displayed institutions and updates the map */
    resetInstitutionFilter() { this.institutionFilter.next(INITIAL_INSTITUTION_FILTER); }

}
