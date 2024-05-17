import { copyAndParsePropertiesAndOwnerProperties } from './parsing.util';

describe('Parsing Util', () => {

    describe('propertyArrayToMap', () => {

        it('should map a property with a single occurrence to the correct attribute', () => {
            expect((copyAndParsePropertiesAndOwnerProperties({
              id: '2c508c58-10fb-4d7a-ae40-e3a3aac65514',
              name: 'Test Node',
              properties: [{ name: 'type', value: 'Node', }],
            } as RawMapNode).properties.type)).toEqual(['Node']);
        });

        it('should map a property with multiple occurrences to the correct attribute', () => {
            expect((copyAndParsePropertiesAndOwnerProperties({
              id: '2c508c58-10fb-4d7a-ae40-e3a3aac65514',
              name: 'Test Node',
              properties: [{ name: 'type', value: 'Site', }, { name: 'type', value: 'Node' }],
            } as RawMapNode).properties.type)).toEqual(['Site', 'Node']);
        });

        it('should map a property with no occurrences to not exist', () => {
            expect((copyAndParsePropertiesAndOwnerProperties({
              id: '2c508c58-10fb-4d7a-ae40-e3a3aac65514',
              name: 'Test Node',
              properties: [],
            } as RawMapNode).properties.type)).toEqual(undefined);
        });

        it('should map two properties to the correct attributes [1 of 2]', () => {
            expect((copyAndParsePropertiesAndOwnerProperties({
              id: '2c508c58-10fb-4d7a-ae40-e3a3aac65514',
              name: 'Test Node',
              properties: [{ name: 'region', value: 'Antarctica' }, { name: 'type', value: 'Node' }]
            } as RawMapNode).properties.type)).toEqual(['Node']);
        });

        it('should map two properties to the correct attributes [2 of 2]', () => {
            expect((copyAndParsePropertiesAndOwnerProperties({
              id: '2c508c58-10fb-4d7a-ae40-e3a3aac65514',
              name: 'Test Node',
              properties: [{ name: 'region', value: 'Antarctica' }, { name: 'type', value: 'Node' }],
            } as RawMapNode).properties.region)).toEqual(['Antarctica']);
        });

        it('should map a property with multiple occurrences including a number to the correct attribute', () => {
            expect((copyAndParsePropertiesAndOwnerProperties({
              id: '2c508c58-10fb-4d7a-ae40-e3a3aac65514',
              name: 'Test Node',
              properties: [{ name: 'type', value: '3.14' }, { name: 'type', value: 'Node' }],
            } as RawMapNode).properties.type)).toEqual(['3.14', 'Node']);
        });

        it('should map a property with multiple occurrences including a null to the correct attribute', () => {
            expect((copyAndParsePropertiesAndOwnerProperties({
              id: '2c508c58-10fb-4d7a-ae40-e3a3aac65514',
              name: 'Test Node',
              properties: [
                {
                  name: 'type',
                  value: null,
                },
                {
                  name: 'type',
                  value: 'Node',
                },
              ],
            } as RawMapNode).properties.type)).toEqual([null, 'Node']);
        });

        it('should map a property with multiple occurrences to the correct attribute when other properties are present', () => {
          expect((copyAndParsePropertiesAndOwnerProperties({
            id: '2c508c58-10fb-4d7a-ae40-e3a3aac65514',
            name: 'Test Node',
            properties: [
              { name: 'type', value: 'Site' },
              { name: 'something else', value: 'Random string' },
              { name: 'type', value: 'Node' },
            ]
          } as RawMapNode).properties.type)).toEqual(['Site', 'Node']);
        });

        it('should map a property with no occurrences to an empty attribute', () => {
          expect((copyAndParsePropertiesAndOwnerProperties({
            id: '2c508c58-10fb-4d7a-ae40-e3a3aac65514',
            name: 'Test Node',
            properties: [
              { name: 'not type', value: 'Random entry' },
              { name: 'something else', value: 'Random string' }
            ]
          } as RawMapNode).properties.type)).toEqual(undefined);
        });
      });
});
