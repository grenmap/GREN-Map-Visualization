import { objectToQueryString, arrayToProjectionString } from './graphql.util';

describe('GraphQL Util', () => {

    // Tests for query strings

    it('should return an empty query string when provided null', () => {
        expect(objectToQueryString(null)).toEqual('', 'Returned query string was not empty');
    });

    it('should return an empty query string when provided undefined', () => {
        expect(objectToQueryString(undefined)).toEqual('', 'Returned query string was not empty');
    });

    it(`should return an empty query string when provided an empty object`, () => {
        expect(objectToQueryString({})).toEqual('', 'Returned query string was not empty');
    });

    it(`should return the expected query string for string properties`, () => {
        const expectedQueryString = `(prop1:"value1", prop2:"value2")`;
        expect(objectToQueryString({ prop1: 'value1', prop2: 'value2' }))
            .toEqual(expectedQueryString, 'Returned query string was not empty');
    });

    it(`should return the expected query string for numerical properties`, () => {
        const expectedQueryString = `(prop1:1, prop2:2)`;
        expect(objectToQueryString({ prop1: 1, prop2: 2 }))
            .toEqual(expectedQueryString, 'Returned query string was not empty');
    });

    it(`should return the expected query string for mixed properties`, () => {
        const expectedQueryString = `(prop1:1, prop2:"value2")`;
        expect(objectToQueryString({ prop1: 1, prop2: 'value2' }))
            .toEqual(expectedQueryString, 'Returned query string was not empty');
    });

    // Tests for projection strings

    it('should return an empty projection string when provided null', () => {
        expect(arrayToProjectionString(null)).toEqual('');
    });

    it('should return an empty projection string when provided undefined', () => {
        expect(arrayToProjectionString(undefined)).toEqual('');
    });

    it(`should return an empty projection string when provided an empty array`, () => {
        expect(arrayToProjectionString([])).toEqual('');
    });

    it(`should return the expected projection string for string properties`, () => {

    });

    it(`should return the expected projection string for numerical properties`, () => {

    });
});
