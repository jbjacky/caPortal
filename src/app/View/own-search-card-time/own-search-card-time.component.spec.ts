import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnSearchCardTimeComponent } from './own-search-card-time.component';

describe('OwnSearchCardTimeComponent', () => {
  let component: OwnSearchCardTimeComponent;
  let fixture: ComponentFixture<OwnSearchCardTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnSearchCardTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnSearchCardTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
