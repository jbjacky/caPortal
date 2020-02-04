import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmCardFormComponent } from './rm-card-form.component';

describe('RmCardFormComponent', () => {
  let component: RmCardFormComponent;
  let fixture: ComponentFixture<RmCardFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmCardFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
