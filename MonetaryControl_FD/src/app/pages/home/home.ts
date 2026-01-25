import { Component, EventEmitter, inject, OnInit, Output, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { CustomInput } from "../../utils/custom-input/custom-input";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Home } from '../../service/home';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ShowExpense } from "../../shared/show-expense/show-expense";
import { ShowUser } from "../../shared/show-user/show-user";
import { Perfil } from '../../service/perfil';
import { Alert } from '../../service/alert';

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
    ShowExpense,
    ShowUser,
    CurrencyPipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Homes implements OnInit {

  private expenseService = inject(Home);
  private perfilService = inject(Perfil);
  private route = inject(ActivatedRoute);
  private alertService = inject(Alert);

  // Controlador de vista actual
  currentView = signal<'expenses' | 'users'>('expenses');

  // 👇 Signals para manejar el panel lateral
  isOpen = signal(false);
  selectedExpenseId = signal<number | null>(null);
  selectedUserId = signal<number | null>(null);

  openDetail(id: number) {
    this.selectedExpenseId.set(id);
    this.isOpen.set(true);
  }

  openUserDetail(id: number) {
    if (id !== null && id !== undefined) {
      this.selectedUserId.set(id);
      this.isOpen.set(true);
    } else {
      this.alertService.invalidId();
    }
  }

  toggleDetail() {
    this.isOpen.set(false);
    this.selectedExpenseId.set(null);
    this.selectedUserId.set(null);
  }

  showForm = false;

  ngOnInit() {
    // Escuchar cambios en los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const view = params['view'];
      if (view === 'users') {
        this.currentView.set('users');
        this.loadUsers();
      } else {
        this.currentView.set('expenses');
        this.loadExpenses();
      }
    });
  }

  loadExpenses() {
    const id = localStorage.getItem('userId');
    if (id) {
      this.expenseService.ListExpenses().subscribe({
        next: (data) => {
          console.log("Gastos:", data);
          const userExpenses = data.filter(e => e.userId == Number(id));
          this.dataSource.data = userExpenses;
        },
        error: (err) => console.error('Error al obtener gastos:', err)
      });
    }
  }

  loadUsers() {
    this.perfilService.ListUsers().subscribe({
      next: (data) => {
        console.log("Usuarios:", data);
        this.dataSourceUsers.data = data;
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });
  }


  miForm = new FormGroup({
    search: new FormControl("", [Validators.required,]),
  });

  miFormUsers = new FormGroup({
    search: new FormControl("", [Validators.required,]),
  });

  // Columnas para gastos
  displayedColumns: string[] = ['expenseId', 'date', 'amount', 'accion'];
  dataSource = new MatTableDataSource<any>([]);

  // Columnas para usuarios
  displayedColumnsUsers: string[] = ['userId', 'userName', 'salary', 'rol', 'accion'];
  dataSourceUsers = new MatTableDataSource<any>([]);

  // 👇 ViewChild para conectar el paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginatorUsers') paginatorUsers!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceUsers.paginator = this.paginatorUsers;
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  filtrarUsers(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSourceUsers.filter = filtro.trim().toLowerCase();
  }

  // Métodos para cambiar de vista
  showExpensesView() {
    this.currentView.set('expenses');
    this.loadExpenses();
  }

  showUsersView() {
    this.currentView.set('users');
    this.loadUsers();
  }


  // -----------------------------
  // Eliminar gasto
  // -----------------------------
  deleteExpense(id: number) {
    this.alertService.confirmDeleteExpense().then((result) => {
      if (result.isConfirmed) {
        this.expenseService.DeleteExpense(id).subscribe({
          next: (res) => {
            this.alertService.expenseDeleted();
            this.dataSource.data = this.dataSource.data.filter((e: any) => e.expenseId !== id);
          },
          error: (err) => {
            this.alertService.deleteExpenseError();
            console.error('Error al eliminar gasto', err);
          }
        });
      }
    });
  }

  // -----------------------------
  // Eliminar usuario
  // -----------------------------
  deleteUser(id: number) {
    this.alertService.confirmDeleteUser().then((result) => {
      if (result.isConfirmed) {
        this.perfilService.DeleteUser(id).subscribe({
          next: (res) => {
            this.alertService.userDeleted();
            this.dataSourceUsers.data = this.dataSourceUsers.data.filter((e: any) => e.userId !== id);
          },
          error: (err) => {
            this.alertService.deleteUserError();
            console.error('Error al eliminar usuario', err);
          }
        });
      }
    });
  }



}
