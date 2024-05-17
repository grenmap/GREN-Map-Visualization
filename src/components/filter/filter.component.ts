import { Component } from '@angular/core';
import { MapService } from 'src/services/map.service';
import { FilterService } from 'src/services/filter.service';
import { NODE_TYPE, LINK_TYPE, NETWORK_ELEMENT_NAMES } from 'src/constants';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent {

  showFilterWindow = false;

  constructor(public filterService: FilterService) { }

  /** This function is responsible for showing or not the filter window */
  public toggleFilters() {
    this.showFilterWindow = !this.showFilterWindow;
  }

  /**
   * This function removes all selected filters. In other words,
   * it makes the map display all nodes and links without any type of filtering.
   */
  public removeAllFilters() {
    this.filterService.resetNodeFilter();
    this.filterService.resetLinkFilter();
  }

  toggle(element: NetworkElement, property: string, filter: string){
    let itemFilter = null;
    if (element === NODE_TYPE) {
      itemFilter = this.filterService.nodeFilter;
    } else if (element === LINK_TYPE) {
      itemFilter = this.filterService.linkFilter;
    }
    const value = itemFilter.value;

    value.properties[property][filter] = !value.properties[property][filter];
    itemFilter.next(value);
  }

  elementName(element: NetworkElement) {
    return NETWORK_ELEMENT_NAMES[element];
  }
}
