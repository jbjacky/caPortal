import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForgetDetailComponent } from './search-forget-detail.component';

describe('SearchForgetDetailComponent', () => {
  let component: SearchForgetDetailComponent;
  let fixture: ComponentFixture<SearchForgetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchForgetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchForgetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
