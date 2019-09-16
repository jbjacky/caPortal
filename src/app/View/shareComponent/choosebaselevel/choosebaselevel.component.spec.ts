import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosebaselevelComponent } from './choosebaselevel.component';

describe('ChoosebaselevelComponent', () => {
  let component: ChoosebaselevelComponent;
  let fixture: ComponentFixture<ChoosebaselevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosebaselevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosebaselevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
