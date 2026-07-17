import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReceipt } from './update-receipt';

describe('UpdateReceipt', () => {
  let component: UpdateReceipt;
  let fixture: ComponentFixture<UpdateReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateReceipt],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateReceipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
