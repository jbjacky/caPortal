import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileuploadbuttonComponent } from './fileuploadbutton.component';

describe('FileuploadbuttonComponent', () => {
  let component: FileuploadbuttonComponent;
  let fixture: ComponentFixture<FileuploadbuttonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileuploadbuttonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileuploadbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
