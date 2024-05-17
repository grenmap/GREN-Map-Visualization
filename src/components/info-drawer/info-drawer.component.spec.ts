import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoDrawerComponent } from './info-drawer.component';
import { QueryService } from 'src/services/query.service';
import { MaterialModule } from 'src/modules/material.module';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GRENMapConfig } from 'src/typings/config';
import { DisplayService } from 'src/services/display.service';
import { MapService } from 'src/services/map.service';
import { FilterService } from 'src/services/filter.service';
import { configDefaults } from 'src/config';

describe('InfoDrawerComponent', () => {
  let component: InfoDrawerComponent;
  let fixture: ComponentFixture<InfoDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDrawerComponent],
      providers: [{ provide: GRENMapConfig, useValue: configDefaults}, QueryService, DisplayService, MapService, FilterService],
      imports: [ MaterialModule, NoopAnimationsModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
