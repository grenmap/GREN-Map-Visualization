import { Pipe, PipeTransform } from '@angular/core';

export type SortOrder = 'asc' | 'desc';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(value: (number | string | object)[], sortOrder: SortOrder | string = 'asc', sortKey?: string): object {
    sortOrder = sortOrder && sortOrder.toLowerCase();

    if (!value || (sortOrder !== 'asc' && sortOrder !== 'desc')) { return value; }

    let numberArray: (number | Record<string, number>)[] = [];
    let stringArray: (string | Record<string, string>)[] = [];

    if (!sortKey) {
      numberArray = value.filter(item => typeof item === 'number').sort() as number[];
      stringArray = value.filter(item => typeof item === 'string').sort() as string[];
    } else {
      numberArray = (
        value.filter(item => typeof item[sortKey] === 'number') as Record<string, number>[]
      ).sort((a, b) => a[sortKey] - b[sortKey]);
      stringArray = (
          value.filter(item => typeof item[sortKey] === 'string') as Record<string, string>[]
        ).sort((a, b) => {
          if (a[sortKey] < b[sortKey]) { return -1; }
          else if (a[sortKey] > b[sortKey]) { return 1; }
          else { return 0; }
        });
    }
    const sorted = [
      ...numberArray,
      ...stringArray,
      ...value.filter(
          item =>
            typeof (sortKey ? item[sortKey] : item) !== 'number' &&
            typeof (sortKey ? item[sortKey] : item) !== 'string',
      ),
     ];
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }

}
