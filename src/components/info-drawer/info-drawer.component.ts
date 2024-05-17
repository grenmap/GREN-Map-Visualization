/**
 * Copyright 2020 GRENMap Authors
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
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DisplayService, DrawerType } from 'src/services/display.service';
import { MapService } from 'src/services/map.service';

@Component({
  selector: 'app-info-drawer',
  templateUrl: './info-drawer.component.html',
  styleUrls: ['./info-drawer.component.scss']
})
export class InfoDrawerComponent {

  openDrawerType: BehaviorSubject<DrawerType>;
  target: BehaviorSubject<MapTarget>;

  constructor(private mapService: MapService, displayService: DisplayService) {
    this.openDrawerType = displayService.openDrawerType;
    this.target = mapService.target;
  }

  close() { this.mapService.setTarget(null); }
}
