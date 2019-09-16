import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnSearchComponent } from './own-search.component';

describe('OwnSearchComponent', () => {
  let component: OwnSearchComponent;
  let fixture: ComponentFixture<OwnSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
