import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionDatatableComponent } from './collection-datatable.component';

describe('CollectionDatatableComponent', () => {
  let component: CollectionDatatableComponent;
  let fixture: ComponentFixture<CollectionDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionDatatableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
