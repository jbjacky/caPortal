import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoteInfComponent } from './rote-inf.component';

describe('RoteInfComponent', () => {
  let component: RoteInfComponent;
  let fixture: ComponentFixture<RoteInfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoteInfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoteInfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
