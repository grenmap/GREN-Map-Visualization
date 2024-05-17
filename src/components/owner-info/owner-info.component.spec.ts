import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnerInfoComponent } from './owner-info.component';
import { MapService } from 'src/services/map.service';
import { SortByPipe } from 'src/pipes/sort-by.pipe';
import { FilterService } from 'src/services/filter.service';
import { QueryService } from 'src/services/query.service';
import { configDefaults } from 'src/config';
import { GRENMapConfig } from 'src/typings/config';
import { DisplayService } from 'src/services/display.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';

describe('OwnerInfoComponent', () => {
  let component: OwnerInfoComponent;
  let fixture: ComponentFixture<OwnerInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerInfoComponent, SortByPipe],
      providers: [
        MapService, FilterService, QueryService, DisplayService,
        MatSnackBar, Overlay,
        { provide: GRENMapConfig, useValue: configDefaults}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
