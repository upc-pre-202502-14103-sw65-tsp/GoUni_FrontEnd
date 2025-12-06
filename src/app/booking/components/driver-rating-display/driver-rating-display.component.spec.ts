import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverRatingDisplayComponent } from './driver-rating-display.component';

describe('DriverRatingDisplayComponent', () => {
  let component: DriverRatingDisplayComponent;
  let fixture: ComponentFixture<DriverRatingDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverRatingDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverRatingDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
