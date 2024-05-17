import { TestBed } from '@angular/core/testing';

import { PositionService } from './position.service';
import { HttpClientModule } from '@angular/common/http';
import { GRENMapConfig } from 'src/typings/config';
import { configDefaults } from 'src/config';

describe('PositionService', () => {
  let service: PositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PositionService,
        { provide: GRENMapConfig, useValue: configDefaults }
      ],
      imports: [HttpClientModule]
    });
    service = TestBed.inject(PositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
