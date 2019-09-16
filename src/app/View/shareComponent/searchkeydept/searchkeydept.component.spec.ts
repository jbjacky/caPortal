import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchkeydeptComponent } from './searchkeydept.component';

describe('SearchkeydeptComponent', () => {
  let component: SearchkeydeptComponent;
  let fixture: ComponentFixture<SearchkeydeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchkeydeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchkeydeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
