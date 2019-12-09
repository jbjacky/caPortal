import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCardPatchDetailComponent } from './search-card-patch-detail.component';

describe('SearchCardPatchDetailComponent', () => {
  let component: SearchCardPatchDetailComponent;
  let fixture: ComponentFixture<SearchCardPatchDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCardPatchDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCardPatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
