import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptVaSearchComponent } from './dept-va-search.component';

describe('DeptVaSearchComponent', () => {
  let component: DeptVaSearchComponent;
  let fixture: ComponentFixture<DeptVaSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptVaSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptVaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
