/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MapComponent } from './map.component';
import { MaterialModule } from 'src/modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { MapService } from 'src/services/map.service';
import { GRENMapConfig } from 'src/typings/config';
import { DisplayService } from 'src/services/display.service';
import { FilterService } from 'src/services/filter.service';
import { QueryService } from 'src/services/query.service';
import { PositionService } from 'src/services/position.service';
import { configDefaults } from 'src/config';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MapComponent],
      providers: [
        { provide: GRENMapConfig, useValue: configDefaults },
        MapService, DisplayService, FilterService, QueryService, PositionService
      ],
      imports: [MaterialModule, HttpClientModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('mapPropertyToStyleValue', () => {
    it('should choose first property\'s style value', () => {
      expect(component.mapPropertyToStyleValue(
        ['first val', 'second val', 'third val'],
        {
          'first val': 'expected style',
          'another val': 'not expected style',
        }
      )).toBe('expected style');
    });

    it('should choose second property\'s style value', () => {
      expect(component.mapPropertyToStyleValue(
        ['first', 'second val', 'third'],
        {
          'non-existent value': 'not expected style',
          'second val': 'expected style',
          'another red herring': 'not expected style',
        }
      )).toBe('expected style');
    });

    it('should choose first matching key\'s style value when more than one matches', () => {
      expect(component.mapPropertyToStyleValue(
        ['first val', 'second val', 'third val'],
        {
          'second val': 'expected style',
          'third val': 'not expected style',
        }
      )).toBe('expected style');
    });

    it('should choose first matching key\'s style value of multiple matches, mixed order', () => {
      expect(component.mapPropertyToStyleValue(
        ['first val', 'second val', 'third val'],
        {
          'third val': 'expected style',
          'second val': 'not expected style',
        }
      )).toBe('expected style');
    });

    it('should choose last matching key\'s style when multiple matches in reverse', () => {
      expect(component.mapPropertyToStyleValue(
        ['first val', 'second val', 'third val'],
        {
          'second val': 'not expected style',
          'third val': 'expected style',
        },
        true
      )).toBe('expected style');
    });

    it('should return undefined when no matches', () => {
      expect(component.mapPropertyToStyleValue(
        ['first', 'second', 'third'],
        {
          'non-existent value': 'not expected style',
          'another red herring': 'not expected style',
        }
      )).toBe(undefined);
    });

    it('should return undefined when array empty', () => {
      expect(component.mapPropertyToStyleValue(
        [],
        {
          'non-existent value': 'not expected style',
          'another red herring': 'not expected style',
        }
      )).toBe(undefined);
    });

    it('should return undefined when mapping empty', () => {
      expect(component.mapPropertyToStyleValue(
        ['first', 'second', 'third'], {}
      )).toBe(undefined);
    });

    it('should return undefined when both inputs empty', () => {
      expect(component.mapPropertyToStyleValue(
        [], {},
      )).toBe(undefined);
    });
  });

});
