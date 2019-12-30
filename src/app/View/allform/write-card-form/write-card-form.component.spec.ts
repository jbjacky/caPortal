import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteCardFormComponent } from './write-card-form.component';

describe('WriteCardFormComponent', () => {
  let component: WriteCardFormComponent;
  let fixture: ComponentFixture<WriteCardFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteCardFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
