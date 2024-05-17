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
 * ----------------------------------------------------------------------------
 * The main component that gets created to combine components
 */
import { Component, OnInit } from '@angular/core';
import { DisplayService } from 'src/services/display.service';
import { QueryService } from 'src/services/query.service';

@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private queryService: QueryService,
    private displayService: DisplayService
  ) { }

  async ngOnInit() {
    try {
      await this.queryService.loadAllData();
    } catch (err) {
      console.error(err);
      this.displayService.showError(err);
    }
  }
}
