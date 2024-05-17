import { SortByPipe } from './sort-by.pipe';
import { dataSort,
  dataSortAscById,
  dataSortDescById,
  dataSortAscByName,
  dataSortDescByName,
  dataSortAscByLat,
  dataSortDescByLat } from '../assets/data/tests_datasets.js';

describe('SortByPipe', () => {

  const pipe = new SortByPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('sort a list in ascending order by id', () => {
    expect(pipe.transform(dataSort, 'asc', 'id')).toEqual(dataSortAscById);
  });

  it('sort a list in descending order by id', () => {
    expect(pipe.transform(dataSort, 'desc', 'id')).toEqual(dataSortDescById);
  });

  it('sort a list in ascending order by name', () => {
    expect(pipe.transform(dataSort, 'asc', 'name')).toEqual(dataSortAscByName);
  });

  it('sort a list in descending order by name', () => {
    expect(pipe.transform(dataSort, 'desc', 'name')).toEqual(dataSortDescByName);
  });

  it('sort a list in ascending order by lat', () => {
    expect(pipe.transform(dataSort, 'asc', 'lat')).toEqual(dataSortAscByLat);
  });

  it('sort a list in descending order by lat', () => {
    expect(pipe.transform(dataSort, 'desc', 'lat')).toEqual(dataSortDescByLat);
  });

});
