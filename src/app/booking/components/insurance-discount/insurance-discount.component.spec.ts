import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDiscountComponent } from './insurance-discount.component';

describe('InsuranceDiscountComponent', () => {
  let component: InsuranceDiscountComponent;
  let fixture: ComponentFixture<InsuranceDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceDiscountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
