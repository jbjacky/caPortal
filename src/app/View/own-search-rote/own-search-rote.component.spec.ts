import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnSearchRoteComponent } from './own-search-rote.component';

describe('OwnSearchRoteComponent', () => {
  let component: OwnSearchRoteComponent;
  let fixture: ComponentFixture<OwnSearchRoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnSearchRoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnSearchRoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
