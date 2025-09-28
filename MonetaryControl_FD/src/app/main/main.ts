import { Component } from '@angular/core';
import { Header } from "../shared/header/header";
import { Sidebar } from "../shared/sidebar/sidebar";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-main',
  imports: [Header, Sidebar, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {

}
