import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CustomInput } from '../../shared/custom-input/custom-input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomTitleHelpLink } from "../../shared/custom-title-help-link/custom-title-help-link";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-change-password',
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
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword {

  miForm = new FormGroup({


    password: new FormControl("", [Validators.required]),
    confirmPassword: new FormControl("", [Validators.required]),
  })


}
