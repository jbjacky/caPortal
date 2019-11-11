import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySearchComponent } from './salary-search.component';

describe('SalarySearchComponent', () => {
  let component: SalarySearchComponent;
  let fixture: ComponentFixture<SalarySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
