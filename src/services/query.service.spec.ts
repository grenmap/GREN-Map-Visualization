/* eslint-disable @typescript-eslint/no-unused-vars */

import { TestBed, inject } from '@angular/core/testing';
import { configDefaults } from 'src/config';
import { GRENMapConfig } from 'src/typings/config';
import { QueryService } from './query.service';

describe('Service: Query', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryService, { provide: GRENMapConfig, useValue: configDefaults } ],
      imports: []
    });
  });

  it('should ...', inject([QueryService], (service: QueryService) => {
    expect(service).toBeTruthy();
  }));

});
