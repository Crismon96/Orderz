import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDatasetModalComponent } from './add-new-dataset-modal.component';

describe('AddNewDatasetModalComponent', () => {
  let component: AddNewDatasetModalComponent;
  let fixture: ComponentFixture<AddNewDatasetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewDatasetModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewDatasetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
