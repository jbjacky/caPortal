import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkOuthpageComponent } from './link-outhpage.component';

describe('LinkOuthpageComponent', () => {
  let component: LinkOuthpageComponent;
  let fixture: ComponentFixture<LinkOuthpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkOuthpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkOuthpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
