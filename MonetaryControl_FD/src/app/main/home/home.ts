import { Component, EventEmitter, inject, OnInit, Output, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { CustomInput } from "../../shared/custom-input/custom-input";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Home } from '../../service/home';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ShowExpense } from "../../shared/show-expense/show-expense";

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    CustomInput,
    RouterModule,
    DatePipe,
    ShowExpense
],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Homes implements OnInit {

  private expenseService = inject(Home);
  private router = inject(Router);


  // 👇 Signals para manejar el panel lateral
  isOpen = signal(false);
  selectedExpenseId = signal<number | null>(null);

  openDetail(id: number) {
    this.selectedExpenseId.set(id);
    this.isOpen.set(true);
  }

  toggleDetail() {
    this.isOpen.set(false);
  }

  showForm = false;

  ngOnInit() {
    const id = localStorage.getItem('userId');

    if (id) {
      this.expenseService.ListExpenses().subscribe({
        next: (data) => {
          // Filtrar por el ID del usuario
          const userExpenses = data.filter(e => e.userId == Number(id));

          // Asignar al datasource de la tabla
          this.dataSource.data = userExpenses;
        },
        error: (err) => console.error('Error al obtener gastos:', err)
      });
    }
  }


  miForm = new FormGroup({
    search: new FormControl("", [Validators.required,]),

  });
  displayedColumns: string[] = ['expenseId', 'date', 'amount', 'accion'];
  dataSource = new MatTableDataSource<any>([]); // se llenará con la API

  // 👇 ViewChild para conectar el paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }


  // -----------------------------
  // Eliminar gasto
  // -----------------------------
  deleteExpense(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este gasto se eliminará de forma permanente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.expenseService.DeleteExpense(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'El gasto se eliminó correctamente',
              timer: 2000,
              showConfirmButton: false
            });

            // 🔹 Opcional: refrescar la lista de gastos
            //this.loadExpenses(); // <-- crea este método para recargar los datos
            this.dataSource.data = this.dataSource.data.filter(e => e.expenseId !== id);
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'Ocurrió un problema al eliminar el gasto',
            });
            console.error('Error al eliminar gasto', err);
          }
        });
      }
    });
  }


  verDetalle(id: number) {
    this.router.navigate(['/show', id]);
  }

}
