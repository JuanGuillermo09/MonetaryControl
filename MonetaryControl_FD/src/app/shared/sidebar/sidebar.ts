import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Auth } from '../../service/auth';
import { Alert } from '../../service/alert';

@Component({
  selector: 'app-sidebar',
  imports: [MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  private auth = inject(Auth)
  private alertService = inject(Alert)

  @Output() Nav = new EventEmitter<void>();

  onClose() {
    this.Nav.emit(); // 🔹 Emite evento al padre (header)
  }

  logout() {

    const userName = localStorage.getItem('userName') || 'Usuario';
    this.auth.logout(); // Llama al método de cierre de sesión

    this.alertService.goodbye(userName);
  }
}
