import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelformComponent } from './delform.component';

describe('DelformComponent', () => {
  let component: DelformComponent;
  let fixture: ComponentFixture<DelformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
