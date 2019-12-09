import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmStateFormWriteComponent } from './rm-state-form-write.component';

describe('RmStateFormWriteComponent', () => {
  let component: RmStateFormWriteComponent;
  let fixture: ComponentFixture<RmStateFormWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmStateFormWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmStateFormWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
