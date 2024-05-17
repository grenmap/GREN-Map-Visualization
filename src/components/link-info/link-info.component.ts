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
import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-link-info',
  templateUrl: './link-info.component.html',
  styleUrls: ['./link-info.component.scss']
})
export class LinkInfoComponent {

  private _link: MapLink;

  @Input()
  get link() { return this._link; }
  set link(value) {
    this._link = value;
  }

}
