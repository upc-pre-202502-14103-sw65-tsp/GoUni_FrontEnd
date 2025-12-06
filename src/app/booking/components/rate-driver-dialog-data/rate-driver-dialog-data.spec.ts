import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateDriverDialogData } from './rate-driver-dialog-data';

describe('RateDriverDialogData', () => {
  let component: RateDriverDialogData;
  let fixture: ComponentFixture<RateDriverDialogData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateDriverDialogData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateDriverDialogData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
