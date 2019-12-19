import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VizardComponent } from './vizard.component';

describe('VizardComponent', () => {
  let component: VizardComponent;
  let fixture: ComponentFixture<VizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VizardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
