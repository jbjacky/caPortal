import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerchkeybaseMAComponent } from './serchkeybase-ma.component';

describe('SerchkeybaseMAComponent', () => {
  let component: SerchkeybaseMAComponent;
  let fixture: ComponentFixture<SerchkeybaseMAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerchkeybaseMAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerchkeybaseMAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
