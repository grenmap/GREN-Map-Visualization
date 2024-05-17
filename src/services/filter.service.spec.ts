import { TestBed, inject } from '@angular/core/testing';
import { configDefaults } from 'src/config';
import { GRENMapConfig } from 'src/typings/config';
import { NODE_TYPE, LINK_TYPE } from 'src/constants';

import {
  FilterService,
  filterElements,
  updateCombinedFilter
} from './filter.service';
import { QueryService } from './query.service';

describe('Service: FilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterService, QueryService, { provide: GRENMapConfig, useValue: configDefaults }],
    });
  });

  it('should ...', inject([FilterService], (service: FilterService) => {
    expect(service).toBeTruthy();
  }));

  describe('createFilterObject', () => {
    it('normal usage', inject([FilterService], (service: FilterService) => {
      const expected = {tag: {tag1: false, tag2: false, tag3: false}};
      const actual = service.createFilterObject(TEST_LINKS, {properties: {}});
      expect(actual).toEqual(expected);
    }));

    it('empty element array', inject([FilterService], (service: FilterService) => {
      const expected = {};
      const actual = service.createFilterObject([], {properties: {}});
      expect(actual).toEqual(expected);
    }));
  });
});

const TEST_LINKS: Readonly<MapLink>[] = [{
  __typename: 'LinkType',
  id: '01',
  name: 'LINK1',
  nodeA: {__typename: 'NodeType', id: '02', latitude: 12.3, longitude: 23.4},
  nodeB: {__typename: 'NodeType', id: '03', latitude: 34.5, longitude: 45.6},
  owners: [{
    __typename: 'InstitutionType',
    id: '04',
    properties: {}
  }],
  properties: {tag: ['tag1', 'tag2'], throughput: ['100']}
},
{
  __typename: 'LinkType',
  id: '05',
  name: 'LINK2',
  nodeA: {__typename: 'NodeType', id: '06', latitude: 32.1, longitude: 43.2},
  nodeB: {__typename: 'NodeType', id: '07', latitude: 54.3, longitude: 65.4},
  owners: [{
    __typename: 'InstitutionType',
    id: '08',
    properties: {}
  }],
  properties: {tag: ['tag1', 'tag3'], throughput: ['10']}
}];

describe('filterElements', () => {
  it('normal usage', () => {
    // TEST_LINKS has two links, both have tag1
    let filter = {properties: {tag: {tag1: true, tag2: false, tag3: false}}};
    let expected = TEST_LINKS;
    let actual = filterElements(TEST_LINKS, filter);
    expect(actual).toEqual(expected);

    // Only the first link in TEST_LINKS has tag2
    filter = {properties: {tag: {tag1: false, tag2: true, tag3: false}}};
    expected = [TEST_LINKS[0]];
    actual = filterElements(TEST_LINKS, filter);
    expect(actual).toEqual(expected);
  });

  it('empty filter', () => {
    const filter = {properties: {}};
    const expected = TEST_LINKS;
    const actual = filterElements(TEST_LINKS, filter);
    expect(actual).toEqual(expected);
  });

  it('empty element array', () => {
    const filter = {properties: {}};
    const expected = [];
    const actual = filterElements([], filter);
    expect(actual).toEqual(expected);
  });
});

describe('updateCombinedFilter', () => {
  it('normal usage', () => {
    const nodeFilterObject: MapNodeFilter = {
      properties: {tag: {tag1: true, tag2: false}}
    };
    const linkFilterObject: MapLinkFilter = {
      properties: {labels: {label1: false, label2: true}}
    };
    const expected: CombinedFilter = [
      {element: NODE_TYPE, property: 'tag', filters: {tag1: true, tag2: false}},
      {element: LINK_TYPE, property: 'labels', filters: {label1: false, label2: true}}
    ];
    const actual = updateCombinedFilter(nodeFilterObject, linkFilterObject);
    expect(actual).toEqual(expected);
  });
});
