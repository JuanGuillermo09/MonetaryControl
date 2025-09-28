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
  imports: [MatSidenavContainer, MatCard, MatToolbar, MatSidenavModule, MatIconModule, MatListModule, MatMenuModule, MatTableModule, DatePipe]
})
export class Dashboard implements AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart!: Chart<'line'>;

  userId = Number(localStorage.getItem('userId'));

  private ExpenseService = inject(Home)
  private perfilService = inject(Perfil);

  user = signal<any | null>(null);



  constructor() {
    const id = localStorage.getItem('userId');
    if (id) {
      const userId = Number(id);

      // 🔹 KPI de salario
      this.perfilService.ListUserId(userId).subscribe({
        next: (data) => {
          const salary = Number(data.salary) || 0;

          this.kpis[0].value = `$${new Intl.NumberFormat('es-CO').format(salary)}`;

          // Disponible (valor quemado por ahora)
          const disponible = 1500000; // valor que ya pusiste
          this.kpis[1].value = `$${new Intl.NumberFormat('es-CO').format(disponible)}`;

          // Conversión respecto al salario
          const porcentaje = salary > 0 ? (disponible / salary) * 100 : 0;
          this.kpis[4].value = `${porcentaje.toFixed(0)}%`;

          // ⚡ Actualizar gráfico con el salario
          if (this.chart) {
            this.chart.data.datasets[0].data = Array(12).fill(salary);
            this.chart.update();
          }
        },
        error: (err) => console.error('Error al obtener usuario:', err)
      });

      // 🔹 KPI de pedidos (solo los del usuario logueado)
      this.ExpenseService.ListExpenses().subscribe({
        next: (data) => {
          const registrosUsuario = data.filter((r: any) => r.userId === userId);
          this.kpis[2].value = registrosUsuario.length.toString();
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

  ngAfterViewInit(): void {
    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Ingresos',
            data: [0, 0, 0, 0, 0, 0],  // placeholder
            borderColor: '#3f51b5',
            backgroundColor: 'rgba(63,81,181,0.3)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Gastos',
            data: [80000, 150000, 200000, 180000, 220000, 260000, 2600000, 260000, 260000, 260000, 260000, 260000], // placeholder
            borderColor: '#e91e63',
            backgroundColor: 'rgba(233,30,99,0.3)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }

  year = new Date().getFullYear();


  kpis = [
    { icon: 'sell', value: '', label: 'Ingresos' },
    { icon: 'sell', value: '', label: 'Disponible' },
    { icon: 'shopping_cart', value: '', label: 'Pedidos' },
    { icon: 'person', value: '', label: 'Usuarios' },
    { icon: 'insights', value: '', label: 'Conversión' },
  ];

  displayedColumns: string[] = ['date', 'category', 'amount'];


  recent = toSignal(this.ExpenseService.ListExpenses(), { initialValue: [] });

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
