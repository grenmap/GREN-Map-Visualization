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

import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RENInfoComponent } from './ren-info.component';
import { MaterialModule } from 'src/modules/material.module';
import { GroupByPipe } from 'src/pipes/group-by.pipe';
import { SortByPipe } from 'src/pipes/sort-by.pipe';
import { MapService } from 'src/services/map.service';
import { QueryService } from 'src/services/query.service';
import { FilterService } from 'src/services/filter.service';
import { GRENMapConfig } from 'src/typings/config';
import { DisplayService } from 'src/services/display.service';
import { configDefaults } from 'src/config';


describe('RENInfoComponent', () => {
  let component: RENInfoComponent;
  let fixture: ComponentFixture<RENInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RENInfoComponent,
        GroupByPipe,
        SortByPipe,
      ],
      providers: [ MapService, QueryService, FilterService, { provide: GRENMapConfig, useValue: configDefaults }, DisplayService ],
      imports: [ MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RENInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
