import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRoteSumComponent } from './search-rote-sum.component';

describe('SearchRoteSumComponent', () => {
  let component: SearchRoteSumComponent;
  let fixture: ComponentFixture<SearchRoteSumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchRoteSumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRoteSumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
