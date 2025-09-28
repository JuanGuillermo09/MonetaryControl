import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExpense } from './manage-expense';

describe('ManageExpense', () => {
  let component: ManageExpense;
  let fixture: ComponentFixture<ManageExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageExpense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageExpense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
