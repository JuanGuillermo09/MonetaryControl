import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CustomInput } from "../../shared/custom-input/custom-input";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomTitleHelpLink } from "../../shared/custom-title-help-link/custom-title-help-link";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recover-password',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    CustomInput,
    CustomTitleHelpLink,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.scss'
})
export class RecoverPassword {

  miForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),

  })


}
