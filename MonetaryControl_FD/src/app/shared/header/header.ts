import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Sidebar } from "../sidebar/sidebar";



@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    CommonModule,
    Sidebar
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  // 👇 signal que mantiene el nombre
  userName = signal<string | null>(localStorage.getItem('userName'));

  isOpen = signal(false);

  openDetail() {
    this.isOpen.set(true); // 🔹 abrir sidebar
  }

  toggleDetail() {
    this.isOpen.set(false); // 🔹 cerrar sidebar
  }



}
