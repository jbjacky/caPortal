import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVaFormComponent } from './search-va-form.component';

describe('SearchVaFormComponent', () => {
  let component: SearchVaFormComponent;
  let fixture: ComponentFixture<SearchVaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
