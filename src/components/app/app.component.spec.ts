import { TestBed, waitForAsync } from '@angular/core/testing';
import { QueryService } from 'src/services/query.service';

import { MaterialModule } from 'src/modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { GRENMapConfig } from 'src/typings/config';
import { DisplayService } from 'src/services/display.service';
import { configDefaults } from '../../config';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: GRENMapConfig, useValue: configDefaults},
        QueryService,
        DisplayService
      ],
      imports: [
        HttpClientModule,
        MaterialModule
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
