import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChangeDetailDRComponent } from './search-change-detail-dr.component';

describe('SearchChangeDetailDRComponent', () => {
  let component: SearchChangeDetailDRComponent;
  let fixture: ComponentFixture<SearchChangeDetailDRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchChangeDetailDRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChangeDetailDRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
