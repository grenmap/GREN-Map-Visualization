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
 * This file contains the functionality to query graphql for visualization data.
 * The data that is returned is considered raw and missing any processing,
 * so it should not be used directly by any components. The data should first go
 * through another service to coerce the format into one that is more consistent
 * accross the application.
 */


import { gql, Apollo } from 'apollo-angular';
import { HttpLink } from '@apollo/client/link/http';
import { InMemoryCache, ApolloClient, ApolloQueryResult } from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { queryInstitution, queryInstitutions } from 'src/queries/institution.query';
import { queryLink, queryLinks } from 'src/queries/link.query';
import { queryNode, queryNodes } from 'src/queries/node.query';
import { GRENMapConfig } from 'src/typings/config';
import { BehaviorSubject } from 'rxjs';
import { INSTITUTION_FIELDS_BASIC, LINK_FIELDS_BASIC, NODE_FIELDS_BASIC } from 'src/constants';
import { copyAndParsePropertiesAndOwnerProperties } from 'src/util/parsing.util';
import { HttpStatusCode } from '@angular/common/http';


const VISUALIZATION_ENDPOINT = 'visualization/graphql/';

// Interfaces for data returned from graphql
interface NodeResult { node: RawMapNode; }
interface NodeResults { nodes: RawMapNode[]; }
interface LinkResult { link: RawMapLink; }
interface LinkResults { links: RawMapLink[]; }
interface InstitutionResult { institution: RawMapInstitution; }
interface InstitutionResults { institutions: RawMapInstitution[]; }


/**
 * This service handles querying the GREN visualization node for
 * the desired information
 */
@Injectable()
export class QueryService {

  /** All nodes currently loaded */
  nodes = new BehaviorSubject<Readonly<MapNode>[]>([]);
  /** All links currently loaded */
  links = new BehaviorSubject<Readonly<MapLink>[]>([]);
  /** All institutions currently loaded */
  institutions = new BehaviorSubject<Readonly<MapInstitution>[]>([]);

  queryInProgress = false;

  constructor(
    private apollo: Apollo,
    private config: GRENMapConfig
  ) {
    const apolloClient = new ApolloClient({
      link: new HttpLink({ uri: `${this.config.endpointURL}${VISUALIZATION_ENDPOINT}` }),
      cache: new InMemoryCache()
    });
    this.apollo.client = apolloClient;
  }

  /**
   * Sends the given query to the visualizations GraphQL endpoint
   */
  private async sendQuery<T>(query: string): Promise<ApolloQueryResult<T>> {
    try {
      return (await this.apollo.query<T>({ query: gql(query), }).toPromise());
    } catch (err) { throw err; }
  }

  async getInstitution(query: MapInstitution, projection: string[]): Promise<Readonly<MapInstitution>> {
    try {
      const institution = (await this.sendQuery<InstitutionResult>(queryInstitution(query, projection))).data.institution;
      const result = copyAndParsePropertiesAndOwnerProperties(institution);
      Object.freeze(result);
      return result;
    } catch (err) { throw err; }
  }

  async getInstitutions(query: MapInstitutions, projection: (string | object)[]): Promise<Readonly<MapInstitution>[]> {
    try {
      const institutions = (await this.sendQuery<InstitutionResults>(queryInstitutions(query, projection))).data.institutions;
      const result = institutions.map(institution => copyAndParsePropertiesAndOwnerProperties(institution));
      Object.freeze(result);
      return result;
    } catch (err) { throw err; }
  }

  async getLink(query: MapLink, projection: (string | object)[]): Promise<Readonly<MapLink>> {
    try {
      const link = (await this.sendQuery<LinkResult>(queryLink(query, projection))).data.link;
      const result = copyAndParsePropertiesAndOwnerProperties(link) as MapLink;
      Object.freeze(result);
      return result;
    } catch (err) { throw err; }
  }

  async getLinks(query: MapLinks, projection: (string | object)[]): Promise<Readonly<MapLink>[]> {
    try {
      const links = (await this.sendQuery<LinkResults>(queryLinks(query, projection))).data.links;
      const result = links.map(link => copyAndParsePropertiesAndOwnerProperties(link)) as MapLink[];
      Object.freeze(result);
      return result;
    } catch (err) { throw err; }
  }

  async getNode(query: MapNode, projection: (string | object)[]): Promise<Readonly<MapNode>> {
    try {
      const node = (await this.sendQuery<NodeResult>(queryNode(query, projection))).data.node;
      const result = copyAndParsePropertiesAndOwnerProperties(node);
      Object.freeze(result);
      return result;
    } catch (err) { throw err; }
  }

  async getNodes(query: MapNodes, projection: (string | object)[]): Promise<Readonly<MapNode>[]> {
    try {
      const nodes = (await this.sendQuery<NodeResults>(queryNodes(query, projection))).data.nodes;
      const result = nodes.map(node => copyAndParsePropertiesAndOwnerProperties(node));
      Object.freeze(result);
      return result;
    } catch (err) {

      throw err;
    }
  }

  /**
   * Loads institutions, nodes and links with the default parameters
   * TODO: Add the ability to load data at different zoom levels and regions
   */
  async loadAllData() {
    try {
      this.queryInProgress = true;
      await Promise.all([
        this.getNodes({}, NODE_FIELDS_BASIC).then(nodes => this.nodes.next(nodes)),
        this.getLinks({}, LINK_FIELDS_BASIC).then(links => this.links.next(links)),
        this.getInstitutions({}, INSTITUTION_FIELDS_BASIC).then(institutions => this.institutions.next(institutions)),
      ]);
    } catch (err) {
      if (err?.networkError?.statusCode === HttpStatusCode.Unauthorized) {
        throw new Error(
          // eslint-disable-next-line max-len
          $localize`Unauthorized to access topology data. Please make sure this host is listed in the "Visualization Map Allowed Origins" section of the GREN Admin site.`
        );
      } else {
        throw err;
      }
    } finally {
      this.queryInProgress = false;
    }
  }

}
