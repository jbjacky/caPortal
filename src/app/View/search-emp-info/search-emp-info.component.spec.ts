import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEmpInfoComponent } from './search-emp-info.component';

describe('SearchEmpInfoComponent', () => {
  let component: SearchEmpInfoComponent;
  let fixture: ComponentFixture<SearchEmpInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEmpInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEmpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
