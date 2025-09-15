import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleTripComponent } from './reschedule-trip.component';

describe('RescheduleTripComponent', () => {
  let component: RescheduleTripComponent;
  let fixture: ComponentFixture<RescheduleTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescheduleTripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescheduleTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
