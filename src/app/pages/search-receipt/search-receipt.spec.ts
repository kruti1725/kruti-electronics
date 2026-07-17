import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchReceipt } from './search-receipt';

describe('SearchReceipt', () => {
  let component: SearchReceipt;
  let fixture: ComponentFixture<SearchReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchReceipt],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchReceipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
