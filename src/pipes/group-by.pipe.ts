import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(collection: Record<string, string>[][], property: string): object[] {
    if (!collection) { return null; }

    const groupedCollection = collection.reduce((previous, current) => {
        if (!previous[current[property]]) {
            previous[current[property]] = [current];
        } else {
            (previous[current[property]] as object[]).push(current);
        }

        return previous;
    }, {});

    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }

}
