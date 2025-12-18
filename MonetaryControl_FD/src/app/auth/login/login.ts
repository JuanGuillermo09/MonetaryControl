import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { CustomInput } from "../../utils/custom-input/custom-input";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomTitleHelpLink } from "../../utils/custom-title-help-link/custom-title-help-link";
import { Auth } from '../../service/auth';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    CustomInput,
    CommonModule,
    ReactiveFormsModule,
    CustomTitleHelpLink,
    MatCheckboxModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private auth = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  miForm!: FormGroup;

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');

    this.miForm = this.fb.group({
      email: new FormControl(savedEmail || '', [Validators.required, Validators.email]),
      password: new FormControl(savedPassword || '', Validators.required),
      rememberMe: new FormControl(!!savedEmail && !!savedPassword)
    });
  }

  get emailCtrl(): FormControl {
    return this.miForm.get('email') as FormControl;
  }

  get passwordCtrl(): FormControl {
    return this.miForm.get('password') as FormControl;
  }

  async submit() {
    if (this.miForm.valid) {
      try {
        const { email, password, rememberMe } = this.miForm.value;

        const result = await lastValueFrom(this.auth.login(email!, password!));

        // ✅ Guardar credenciales si el usuario marcó "recordarme"
        if (rememberMe) {
          localStorage.setItem('savedEmail', email!);
          localStorage.setItem('savedPassword', password!);
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }

        await Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          html: `<h4>${result.userName}</h4>
        <p>Has iniciado sesión correctamente</p>`,
          timer: 1000,
          showConfirmButton: false
        });

        this.router.navigate(['/dashboard']);
      } catch (error: any) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Credenciales inválidas',
          text: 'Por favor corregir'
        });
      }
    } else {
      this.miForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos'
      });
    }
  }


}
