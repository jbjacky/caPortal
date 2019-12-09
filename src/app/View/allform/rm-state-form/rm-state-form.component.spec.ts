import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmStateFormComponent } from './rm-state-form.component';

describe('RmStateFormComponent', () => {
  let component: RmStateFormComponent;
  let fixture: ComponentFixture<RmStateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmStateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmStateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
