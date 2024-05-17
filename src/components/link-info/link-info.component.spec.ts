/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkInfoComponent } from './link-info.component';
import { MaterialModule } from 'src/modules/material.module';
import { PropertyRead } from '@angular/compiler';

describe('LinkInfoComponent', () => {
  let component: LinkInfoComponent;
  let fixture: ComponentFixture<LinkInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LinkInfoComponent],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkInfoComponent);
    component = fixture.componentInstance;
    component.link = {
      name: 'Test Link',
      nodeA: {
        name: 'test1'
      },
      nodeB: {
        name: 'test2'
      },
      properties: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
