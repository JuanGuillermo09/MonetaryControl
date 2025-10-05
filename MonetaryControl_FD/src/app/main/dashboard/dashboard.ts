import { AfterViewInit, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatSidenavContainer, MatSidenavModule } from "@angular/material/sidenav";
import { MatCard } from "@angular/material/card";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Perfil } from '../../service/perfil';
import { Home } from '../../service/home';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [MatSidenavContainer, MatCard, MatToolbar, MatSidenavModule, MatIconModule, MatListModule, MatMenuModule, MatTableModule]
})
export class Dashboard {


  userId = Number(localStorage.getItem('userId'));

  private ExpenseService = inject(Home)
  private perfilService = inject(Perfil);


  totalGastos: number = 0;

  Salary1: any;

  MenosSalary: any;

  recent = signal<any[]>([]);

  constructor() {
    const id = localStorage.getItem('userId');
    if (id) {
      const userId = Number(id);

      // 🔹 KPI de salario
      this.perfilService.ListUserId(userId).subscribe({
        next: (data) => {
          const salary = Number(data.salary) || 0;
          this.Salary1 = salary
          this.kpis[0].value = `$${new Intl.NumberFormat('es-CO').format(salary)}`;
        },
        error: (err) => console.error('Error al obtener usuario:', err)
      });

      // 🔹 KPI de gastos últimos 30 días (solo usuario logueado)
      this.ExpenseService.ListExpenses().subscribe({
        next: (data) => {
          // Actualizamos la lista completa de gastos
          this.recent.set(data);
          // Usamos directamente el filtro que ya tienes
          const registrosUsuario = this.filteredRecent();
          // Sumamos los gastos
          const totalGastos = registrosUsuario.reduce((acc: number, r: any) => acc + (Number(r.amount) || 0), 0);
          this.MenosSalary = this.Salary1 - totalGastos
          // Mostramos el total en formato de pesos
          this.kpis[2].value = `$${new Intl.NumberFormat('es-CO').format(totalGastos)}`;

          this.kpis[1].value = `$${new Intl.NumberFormat('es-CO').format(this.MenosSalary)}`;

          const porcentaje = this.Salary1 > 0 ? (this.MenosSalary / this.Salary1) * 100 : 0;
          this.kpis[4].value = `${porcentaje.toFixed(0)}%`;

        },
        error: (err) => console.error('Error al obtener gastos:', err)
      });
    }

    // 🔹 KPI de usuarios totales
    this.perfilService.ListUsers().subscribe({
      next: (usuarios) => {
        this.kpis[3].value = usuarios.length.toString();
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });
  }


  kpis = [
    { icon: 'monetization_on', value: '', label: 'Ingresos' },
    { icon: 'attach_money', value: '', label: 'Disponible' },
    { icon: 'shopping_cart', value: '', label: 'Gastos Ultimos(30 Dias)' },
    { icon: 'person', value: '', label: 'Usuarios' },
    { icon: 'insights', value: '', label: 'Conversión' },
  ];

  // Filtramos solo registros del usuario y últimos 30 días
  filteredRecent = computed(() => {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    return this.recent().filter(r => {
      const fecha = new Date(r.date);
      return r.userId === this.userId && fecha >= hace30Dias;
    });
  });



}
