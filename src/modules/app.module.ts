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
 * Bootstraped module for angular application
 */
import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule } from '@angular/core';

import { AppComponent } from 'src/components/app/app.component';
import { MapComponent } from 'src/components/map/map.component';
import { InfoDrawerComponent } from 'src/components/info-drawer/info-drawer.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QueryService } from 'src/services/query.service';
import { PositionService } from 'src/services/position.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NodeInfoComponent } from 'src/components/node-info/node-info.component';
import { LinkInfoComponent } from 'src/components/link-info/link-info.component';
import { RENInfoComponent } from 'src/components/ren-info/ren-info.component';
import { OwnerInfoComponent } from 'src/components/owner-info/owner-info.component';
import { LogoComponent } from 'src/components/logo/logo.component';
import { GroupByPipe } from 'src/pipes/group-by.pipe';
import { SortByPipe } from 'src/pipes/sort-by.pipe';
import { StripURLPipe } from 'src/pipes/strip-url.pipe';
import { MapService } from 'src/services/map.service';
import { GRENMapConfig } from 'src/typings/config';
import { FilterComponent} from 'src/components/filter/filter.component';
import { FilterService } from 'src/services/filter.service';
import { DisplayService } from 'src/services/display.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GroupByPipe,
    SortByPipe,
    FilterComponent,
    InfoDrawerComponent,
    NodeInfoComponent,
    LinkInfoComponent,
    OwnerInfoComponent,
    RENInfoComponent,
    LogoComponent,
    StripURLPipe
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    HttpClientModule,
    QueryService,
    StripURLPipe,
    SortByPipe,
    PositionService,
    FilterService,
    DisplayService,
    MapService,
  ],
})
export class AppModule {

  constructor(private config: GRENMapConfig) { }

  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent, this.config.selector);
  }
}
