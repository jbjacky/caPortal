import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmCardFormWriteComponent } from './rm-card-form-write.component';

describe('RmCardFormWriteComponent', () => {
  let component: RmCardFormWriteComponent;
  let fixture: ComponentFixture<RmCardFormWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmCardFormWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmCardFormWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
