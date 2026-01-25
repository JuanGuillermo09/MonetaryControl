import { Component, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Home } from '../../service/home';
import { Alert } from '../../service/alert';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-show-expense',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DatePipe,
    CurrencyPipe,
    CommonModule,
    MatDividerModule,
    MatIconModule


  ],
  templateUrl: './show-expense.html',
  styleUrl: './show-expense.scss'
})
export class ShowExpense {
  private expenseService = inject(Home);
  private alertService = inject(Alert);

  @Input() expenseId!: number | null;
  @Output() close = new EventEmitter<void>();

  expense: any;
  loading = true;

  ngOnInit() {
    if (this.expenseId) {
      this.expenseService.ListExpenseId(this.expenseId).subscribe({
        next: (res) => {
          this.expense = res;
          this.loading = false;
        },
        error: (err) => {
          this.alertService.loadingError();
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  onClose() {
    this.close.emit();
  }
}
