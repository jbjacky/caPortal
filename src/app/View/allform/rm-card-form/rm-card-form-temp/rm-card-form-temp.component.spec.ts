import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmCardFormTempComponent } from './rm-card-form-temp.component';

describe('RmCardFormTempComponent', () => {
  let component: RmCardFormTempComponent;
  let fixture: ComponentFixture<RmCardFormTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmCardFormTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmCardFormTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
