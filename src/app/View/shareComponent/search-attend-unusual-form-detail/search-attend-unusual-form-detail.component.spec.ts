import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAttendUnusualFormDetailComponent } from './search-attend-unusual-form-detail.component';

describe('SearchAttendUnusualFormDetailComponent', () => {
  let component: SearchAttendUnusualFormDetailComponent;
  let fixture: ComponentFixture<SearchAttendUnusualFormDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAttendUnusualFormDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAttendUnusualFormDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
