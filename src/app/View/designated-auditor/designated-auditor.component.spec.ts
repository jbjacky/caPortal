import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignatedAuditorComponent } from './designated-auditor.component';

describe('DesignatedAuditorComponent', () => {
  let component: DesignatedAuditorComponent;
  let fixture: ComponentFixture<DesignatedAuditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignatedAuditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignatedAuditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
