import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionDataviewComponent } from './collection-dataview.component';

describe('CollectionDataviewComponent', () => {
  let component: CollectionDataviewComponent;
  let fixture: ComponentFixture<CollectionDataviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionDataviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionDataviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
