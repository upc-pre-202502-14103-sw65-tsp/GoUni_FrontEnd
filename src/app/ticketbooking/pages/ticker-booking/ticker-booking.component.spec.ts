import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerBookingComponent } from './ticker-booking.component';

describe('TickerBookingComponent', () => {
  let component: TickerBookingComponent;
  let fixture: ComponentFixture<TickerBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TickerBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TickerBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
