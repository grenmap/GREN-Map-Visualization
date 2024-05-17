import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { MapService } from 'src/services/map.service';
import { FilterService } from 'src/services/filter.service';
import { QueryService } from 'src/services/query.service';
import { GRENMapConfig } from 'src/typings/config';
import { configDefaults } from 'src/config';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      providers: [ MapService, FilterService, QueryService, { provide: GRENMapConfig, useValue: configDefaults } ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
