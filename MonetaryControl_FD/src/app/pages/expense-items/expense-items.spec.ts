import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseItems } from './expense-items';

describe('ExpenseItems', () => {
  let component: ExpenseItems;
  let fixture: ComponentFixture<ExpenseItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
