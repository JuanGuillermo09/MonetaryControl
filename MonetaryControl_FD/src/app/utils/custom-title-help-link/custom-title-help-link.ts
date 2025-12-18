import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-custom-title-help-link',
  imports: [MatCardModule, RouterModule],
  templateUrl: './custom-title-help-link.html',
  styleUrl: './custom-title-help-link.scss'
})
export class CustomTitleHelpLink {

  @Input() title!: string;       // Texto que se muestra
  // @Input() routerLink!: string ;     // Ruta a la que redirige
  @Input() helpText!: string;
  @Input() className!: string;       // Clases CSS opcionales

  @Input() routerLink!: string;

}
