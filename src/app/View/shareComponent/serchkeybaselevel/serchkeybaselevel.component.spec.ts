import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerchkeybaselevelComponent } from './serchkeybaselevel.component';

describe('SerchkeybaselevelComponent', () => {
  let component: SerchkeybaselevelComponent;
  let fixture: ComponentFixture<SerchkeybaselevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerchkeybaselevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerchkeybaselevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
