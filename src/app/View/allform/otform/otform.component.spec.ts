import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtformComponent } from './otform.component';

describe('OtformComponent', () => {
  let component: OtformComponent;
  let fixture: ComponentFixture<OtformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
