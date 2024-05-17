import { Component, Input } from '@angular/core';

import { MapService } from 'src/services/map.service';

@Component({
  selector: 'app-owner-info',
  templateUrl: './owner-info.component.html',
  styleUrls: ['./owner-info.component.scss']
})

export class OwnerInfoComponent {

  private _owners: MapInstitution[];

  @Input()
  get owners() { return this._owners; }
  set owners(value) {
    this._owners = value;
  }

  constructor(private mapService: MapService) { }

  /** Focuses the map view on the provided owner */
  zoomToSelectedOwner(owner: MapInstitution): void{
    this.mapService.zoomToSelectedOwner(owner);
  }

}
