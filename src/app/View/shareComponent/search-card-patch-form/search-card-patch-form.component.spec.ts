import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCardPatchFormComponent } from './search-card-patch-form.component';

describe('SearchCardPatchFormComponent', () => {
  let component: SearchCardPatchFormComponent;
  let fixture: ComponentFixture<SearchCardPatchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCardPatchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCardPatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
