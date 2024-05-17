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
 * Type definitions for data comming in from GraphQL queries.
 * This file should not contain data, and should only contain interfaces
 * 
 * Raw types specify the data that can be requested from the graphql query,
 * and should never be modified downstream of the query service
 */

import { INSTITUTION_TYPE, LINK_TYPE, NODE_TYPE } from "src/constants";

export {};

declare global{

  export type NetworkElement = (
    typeof LINK_TYPE | typeof NODE_TYPE | typeof INSTITUTION_TYPE
  );

  export interface GraphQLType {
    /** The model type of the object */
    __typename?: NetworkElement;
  }
  /** A key and value representing a single property entry */
  export interface Property {
    name?: string;
    value?: string;
  }

  /** Properties as they are represented when coming from the graphql server */
  export interface RawPropertyContainer {
    properties?: Property[];
  }

  /** Parsed properties from the server in a key array pair */
  export interface PropertyContainer {
    properties?: Record<string, string[]>;
  }

  /** Data that has owners that have not yet been parsed */
  export interface RawOwnerContainer {
    owners?: RawMapInstitution[];
  }

  /** Data that has owners that have been parsed */
  export interface OwnerContainer {
    owners?: MapInstitution[];
  }

  /** Id for when querying a single data element */
  export interface SingleQuery {
    id?: string;
  }

  export interface RawMapNodes extends GraphQLType, RawPropertyContainer, RawOwnerContainer {
    /** The full display name of the node */
    name?: string;
    /** The shortened display name of the node */
    shortName?: string;
    /** The start date from which the node is valid */
    start?: Date;
    /** The end date from which the node is valid */
    end?: Date;
    /** The latitude of the node */
    latitude?: number;
    /** The longitude of the node */
    longitude?: number;
    /** The owners of nodes adjacent to this one */
    connectedOwners?: RawMapInstitution[];
    __typename?: typeof NODE_TYPE;
  }

  export interface RawMapLinks extends GraphQLType, RawPropertyContainer, RawOwnerContainer {
    name?: string;
    shortName?: string;
    nodeA?: RawMapNode;
    nodeB?: RawMapNode;
    start?: Date;
    end?: Date;
    __typename?: typeof LINK_TYPE;
  }

  export interface RawMapInstitutions extends GraphQLType, RawPropertyContainer {
    name?: string;
    shortName?: string;
    latitude?: number;
    longitude?: number;
    __typename?: typeof INSTITUTION_TYPE;
  }

  /** Specifies the types of nodes to display on the map */
  export interface MapNodeFilter {
    /** If the node has at least one of the properties
     * in this filter with at least one of the values in the array,
     * then it will be displayed
     */
    properties: Record<string, Record<string, boolean>>
  }

  /** Specifies the types of links to display on the map */
  export interface MapLinkFilter {
    properties: Record<string, Record<string, boolean>>
  }

  /** Type of the filter that contains selected properties of nodes and links */
  export type CombinedFilter = Array<{element: NetworkElement, property: string, filters: Record<string, boolean>}>;

  /** Specifies the types of institutions to display on the map */
  export interface MapInstitutionFilter {
    // TODO: Define how institutions are filtered
  }
  
  /** Helper type to remove raw fields from a type */
  type OmitRaw<T> = Omit<T, 'properties'|'owners'>

  // The types below are what is returned from the server when a query is made
  // for a single value
  export type RawMapNode = RawMapNodes & SingleQuery;
  export type RawMapLink = RawMapLinks & SingleQuery;
  export type RawMapInstitution = RawMapInstitutions & SingleQuery;

  // The types below represent the shape of the data after is is processed by
  // the query service
  export type MapNodes = OmitRaw<RawMapNodes> & PropertyContainer & OwnerContainer;
  export type MapLinks = OmitRaw<RawMapLinks> & PropertyContainer & OwnerContainer & { nodeA?: MapNode, nodeB?: MapNode };
  export type MapInstitutions = OmitRaw<RawMapInstitutions> & PropertyContainer;

  export type MapNode = MapNodes & SingleQuery;
  export type MapLink = MapLinks & SingleQuery;
  export type MapInstitution = MapInstitutions & SingleQuery;

  /** An element that can be focused on */
  export type MapTarget = MapNode | MapLink | MapInstitution;
}
