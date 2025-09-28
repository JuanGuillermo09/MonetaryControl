import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { CustomInput } from "../../shared/custom-input/custom-input";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Home } from '../../service/home';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, MatTableModule, MatPaginatorModule, MatInputModule, CustomInput, RouterModule, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Homes implements OnInit {

  private expenseService = inject(Home);

  showForm = false;

  // Mostrar el formulario
  openForm() {
    this.showForm = true;
  }

  // Ocultar el formulario (opcional)
  closeForm() {
    this.showForm = false;
  }

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
}
