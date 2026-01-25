import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { Perfil } from '../../service/perfil';
import { UserRole } from '../../service/user-role';
import { CustomInput } from "../../utils/custom-input/custom-input";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Alert } from '../../service/alert';
import { Router } from '@angular/router';
import { CustomTitleHelpLink } from "../../utils/custom-title-help-link/custom-title-help-link";

@Component({
  selector: 'app-register-user',
  imports: [CustomInput, ReactiveFormsModule, MatCardModule, MatSelectModule, MatFormFieldModule, CustomTitleHelpLink],
  templateUrl: './register-user.html',
  styleUrl: './register-user.scss'
})
export class RegisterUser implements OnInit {

  private perfilService = inject(Perfil);
  private userRoleService = inject(UserRole);
  private alertService = inject(Alert);
  private router = inject(Router);

  @Output() userCreated = new EventEmitter<void>();

  roles = signal<any[]>([]);

  userForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    salary: new FormControl('0'),
    userRolesId: new FormControl<number | null>(null, [Validators.required]),
    isActive: new FormControl(true),
    ProfilePhoto: new FormControl<File | null>(null),
  });

  // Imagen
  previewUrl: string | ArrayBuffer | null = null;
  imagenBase64: string | null = null;

  constructor() { }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    console.log('Cargando roles...');
    this.userRoleService.ListUserRole().subscribe({
      next: (roles) => {
        console.log('Roles cargados:', roles);
        this.roles.set(roles);
      },
      error: (err: any) => {
        console.error('Error al cargar roles:', err);
      }
    });
  }

  // -----------------------------
  // Selección de archivo
  // -----------------------------
  onFileSelected(event: any) {
    const file: File = event.target.files[0]!;

    if (file) {
      // Guardamos el File en el form
      this.userForm.patchValue({ ProfilePhoto: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result; // Vista previa
        // Guardamos solo la parte Base64
        this.imagenBase64 = (reader.result as string).split(',')[1];
        console.log('Imagen Base64 asignada:', this.imagenBase64.substring(0, 50) + '...');
      };
      reader.readAsDataURL(file);
    }
  }

  // -----------------------------
  // Convertir Base64 a Blob
  // -----------------------------
  base64ToBlob(base64: string, contentType = 'image/png'): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }


  // -----------------------------
  // Guardar usuario
  // -----------------------------
  saveUser() {
    if (this.userForm.invalid) {
      this.alertService.incompleteForm();
      return;
    }

    const { password, confirmPassword, ProfilePhoto, ...userData } = this.userForm.value;

    if (password !== confirmPassword) {
      this.alertService.passwordsNotMatch();
      return;
    }

    // Verificar si el email ya existe
    this.perfilService.ListUsers().subscribe({
      next: (users) => {
        const emailExists = users.some(user => user.email.toLowerCase() === (userData.email || '').toLowerCase());

        if (emailExists) {
          this.alertService.emailAlreadyRegistered();
          return;
        }

        // Si no existe, crear usuario
        const createUserDto = {
          userName: userData.userName,
          email: userData.email,
          salary: userData.salary,
          userRolesId: userData.userRolesId,
          isActive: userData.isActive ?? true,
          password: password
        };

        console.log('==== DTO a enviar ====');
        console.log('createUserDto:', createUserDto);

        this.perfilService.CreateUser(createUserDto).subscribe({
          next: () => {
            console.log('Usuario creado correctamente');
            this.alertService.userCreated();
            this.userCreated.emit();
            this.router.navigate(['/home?view=users']);
          },
          error: (err: any) => {
            console.error('Error al crear usuario:', err);
            this.alertService.createUserError(err);
          }
        });
      },
      error: (err: any) => {
        console.error('Error al verificar email:', err);
        this.alertService.emailVerificationError();
      }
    });
  }

  clearForm() {
    this.userForm.reset();
    this.previewUrl = null;
    this.imagenBase64 = null;
  }
}
