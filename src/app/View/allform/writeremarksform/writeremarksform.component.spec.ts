import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteremarksformComponent } from './writeremarksform.component';

describe('WriteremarksformComponent', () => {
  let component: WriteremarksformComponent;
  let fixture: ComponentFixture<WriteremarksformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteremarksformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteremarksformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
