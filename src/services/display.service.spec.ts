import { Overlay } from '@angular/cdk/overlay';
import { TestBed, inject } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DisplayService } from './display.service';

describe('Service: DisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisplayService, MatSnackBar, Overlay],
    });
  });

  it('should ...', inject([DisplayService], (service: DisplayService) => {
    expect(service).toBeTruthy();
  }));
});
