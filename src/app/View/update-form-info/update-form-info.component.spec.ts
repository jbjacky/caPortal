import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFormInfoComponent } from './update-form-info.component';

describe('UpdateFormInfoComponent', () => {
  let component: UpdateFormInfoComponent;
  let fixture: ComponentFixture<UpdateFormInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFormInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFormInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
