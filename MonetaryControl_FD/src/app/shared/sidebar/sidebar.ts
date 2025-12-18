import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Auth } from '../../service/auth';
import Swal from 'sweetalert2';

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

  @Output() Nav = new EventEmitter<void>();

  onClose() {
    this.Nav.emit(); // 🔹 Emite evento al padre (header)
  }

  logout() {

    const userName = localStorage.getItem('userName') || 'Usuario';
    this.auth.logout(); // Llama al método de cierre de sesión

    Swal.fire({
      icon: 'info',
      title: '¡Hasta luego!',
      html: `<h4>${userName}</h4>
      <p>Vuelve pronto, te estaremos esperando</p>`,
      timer: 2000,
      showConfirmButton: false
    });
  }
}
