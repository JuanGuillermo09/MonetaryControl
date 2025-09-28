import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';



@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  // 👇 signal que mantiene el nombre
  userName = signal<string | null>(localStorage.getItem('userName'));

  @Output() menuClick = new EventEmitter<void>();

  onMenuClick() {
    this.menuClick.emit();
  }


}
