import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWriteComponent } from './test-write.component';

describe('TestWriteComponent', () => {
  let component: TestWriteComponent;
  let fixture: ComponentFixture<TestWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
