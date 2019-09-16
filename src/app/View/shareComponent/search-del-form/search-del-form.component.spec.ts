import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDelFormComponent } from './search-del-form.component';

describe('SearchDelFormComponent', () => {
  let component: SearchDelFormComponent;
  let fixture: ComponentFixture<SearchDelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
