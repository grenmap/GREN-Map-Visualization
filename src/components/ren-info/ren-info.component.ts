/**
 * Copyright 2020 UFRGS.
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
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapService } from 'src/services/map.service';
import { QueryService } from 'src/services/query.service';

@Component({
  selector: 'app-ren-info',
  templateUrl: './ren-info.component.html',
  styleUrls: ['./ren-info.component.scss']
})
export class RENInfoComponent implements OnInit, OnDestroy {

  acceptedTypes = ['NREN', 'SREN', 'PREN'];

  subscriptions = [] as Subscription[];

  rens: MapInstitution[];

  constructor(private mapService: MapService, private queryService: QueryService) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.queryService.institutions.subscribe(institutions => {
        this.rens = institutions.filter(i => {
          return i.properties?.tag?.some(tag => this.acceptedTypes.includes(tag));
        });
      })
    );
  }

  /** Focuses the map view on the provided owner */
  zoomToSelectedOwner(owner: MapInstitution): void{
    this.mapService.zoomToSelectedOwner(owner);
  }

}
