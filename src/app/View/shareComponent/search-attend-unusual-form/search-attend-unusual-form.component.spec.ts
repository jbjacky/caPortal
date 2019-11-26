import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAttendUnusualFormComponent } from './search-attend-unusual-form.component';

describe('SearchAttendUnusualFormComponent', () => {
  let component: SearchAttendUnusualFormComponent;
  let fixture: ComponentFixture<SearchAttendUnusualFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAttendUnusualFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAttendUnusualFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
