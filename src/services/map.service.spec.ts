import { Overlay } from '@angular/cdk/overlay';
import { TestBed, inject } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { configDefaults } from 'src/config';
import { GRENMapConfig } from 'src/typings/config';
import { DisplayService } from './display.service';
import { FilterService } from './filter.service';

import { MapService } from './map.service';
import { QueryService } from './query.service';

describe('Service: MapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapService, FilterService, QueryService, DisplayService, MatSnackBar, Overlay,
        { provide: GRENMapConfig, useValue: configDefaults }
      ],
    });
  });

  it('should ...', inject([MapService], (service: MapService) => {
    expect(service).toBeTruthy();
  }));
});
