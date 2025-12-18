import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-custom-input',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,

  ],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.scss'
})
export class CustomInput {
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() placeholder!: string;
  @Input() icon!: string;
  @Input() disabled: boolean = false;


  hide: boolean = true;
 

  togglePassword() {
    this.hide = !this.hide;
  }



}
