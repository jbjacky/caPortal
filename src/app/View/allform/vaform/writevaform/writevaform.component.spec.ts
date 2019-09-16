import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WritevaformComponent } from './writevaform.component';

describe('WritevaformComponent', () => {
  let component: WritevaformComponent;
  let fixture: ComponentFixture<WritevaformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WritevaformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WritevaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
