import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchkeydeptMAComponent } from './searchkeydept-ma.component';

describe('SearchkeydeptMAComponent', () => {
  let component: SearchkeydeptMAComponent;
  let fixture: ComponentFixture<SearchkeydeptMAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchkeydeptMAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchkeydeptMAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
