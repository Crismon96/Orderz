import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePanelComponent } from './offline-panel.component';

describe('OfflinePanelComponent', () => {
  let component: OfflinePanelComponent;
  let fixture: ComponentFixture<OfflinePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfflinePanelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
