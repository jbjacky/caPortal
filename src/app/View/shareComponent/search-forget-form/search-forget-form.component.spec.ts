import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForgetFormComponent } from './search-forget-form.component';

describe('SearchForgetFormComponent', () => {
  let component: SearchForgetFormComponent;
  let fixture: ComponentFixture<SearchForgetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchForgetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchForgetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
