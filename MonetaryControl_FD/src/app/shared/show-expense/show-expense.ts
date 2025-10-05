import { Component, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Home } from '../../service/home';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenav } from '@angular/material/sidenav';
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
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar la información del gasto'
          });
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
