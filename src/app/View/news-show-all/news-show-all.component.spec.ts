import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsShowAllComponent } from './news-show-all.component';

describe('NewsShowAllComponent', () => {
  let component: NewsShowAllComponent;
  let fixture: ComponentFixture<NewsShowAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsShowAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsShowAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
