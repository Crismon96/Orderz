import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCollectionModalComponent } from './add-new-collection-modal.component';

describe('AddNewCollectionModalComponent', () => {
  let component: AddNewCollectionModalComponent;
  let fixture: ComponentFixture<AddNewCollectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewCollectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCollectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
