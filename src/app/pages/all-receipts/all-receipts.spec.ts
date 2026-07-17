import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReceipts } from './all-receipts';

describe('AllReceipts', () => {
  let component: AllReceipts;
  let fixture: ComponentFixture<AllReceipts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllReceipts],
    }).compileComponents();

    fixture = TestBed.createComponent(AllReceipts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
