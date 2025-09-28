import { Component, inject, signal } from '@angular/core';
import { Perfil } from '../../service/perfil';
import { CustomInput } from "../../shared/custom-input/custom-input";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { CustomTitleHelpLink } from "../../shared/custom-title-help-link/custom-title-help-link";
import { ChangePassword } from '../../service/change-password';

@Component({
  selector: 'app-profile',
  imports: [CustomInput, ReactiveFormsModule, MatCardModule, CustomTitleHelpLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  private perfilService = inject(Perfil);
  private changePasswordService = inject(ChangePassword);

  user = signal<any | null>(null);

  userForm = new FormGroup({
    userName: new FormControl(""),
    email: new FormControl(""),
    salary: new FormControl(), // Nuevo campo de salario
    roleName: new FormControl(""),
    isActive: new FormControl(""),
    ProfilePhoto: new FormControl<File | null>(null),
  });


  // Imagen
  previewUrl: string | ArrayBuffer | null = null;
  imagenBase64: string | null = null;

  isEditing = false;

  constructor() {
    const id = localStorage.getItem('userId');
    if (id) {
      this.perfilService.ListUserId(Number(id)).subscribe({
        next: (data) => {
          this.user.set(data);
          this.userForm.patchValue({
            userName: data.userName,
            email: data.email,
            salary: data.salary, // Asignar salario al formulario
            roleName: data.roleName,
            isActive: data.isActive ? 'Activo' : 'Inactivo'
          });
        },
        error: (err) => console.error('Error al obtener usuario:', err)
      });
    }
  }

  ngOnInit() {
    // Bloquear todo al inicio
    this.miForm.disable();
    this.userForm.disable();
    this.userForm.controls.roleName.disable();
    this.userForm.controls.isActive.disable();
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
    if (!this.isEditing) return;

    const idStr = localStorage.getItem('userId');
    if (!idStr) return console.error('No hay userId en localStorage');
    const id = Number(idStr);
    if (isNaN(id)) return console.error('ID inválido:', idStr);

    const formData = new FormData();
    formData.append('userName', this.userForm.value.userName ?? '');
    formData.append('email', this.userForm.value.email ?? '');
    formData.append('salary', this.userForm.value.salary ?? '0'); // Agregar salario
    formData.append('IsActive', String(this.user()?.isActive ?? true));
    formData.append('UserRolesId', String(this.user()?.userRolesId ?? 1));
    formData.append('UserId', String(id));

    console.log('==== Datos del formulario antes de enviar ====');
    console.log('userName:', this.userForm.value.userName);
    console.log('email:', this.userForm.value.email);
    console.log('salary:', this.userForm.value.salary);
    console.log('IsActive:', this.user()?.isActive);
    console.log('UserRolesId:', this.user()?.userRolesId);
    console.log('UserId:', id);

    // Convertir Base64 a Blob y agregar al FormData
    if (this.imagenBase64) {
      console.log('==== Imagen Base64 detectada ====');
      const blob = this.base64ToBlob(this.imagenBase64, 'image/png');
      console.log('==== Blob generado ====');
      console.log('Blob size:', blob.size, 'type:', blob.type);

      formData.append('ProfilePhoto', blob, `user_${id}.png`);
    } else {
      console.log('No hay imagen Base64 para enviar');
    }

    console.log('==== FormData final a enviar ====');
    formData.forEach((value, key) => console.log(key, value));

    this.perfilService.UpdateUser(id, formData).subscribe({
      next: (res) => {
        console.log('Usuario guardado correctamente', res);
        this.userForm.disable();
        this.userForm.controls.roleName.disable();
        this.userForm.controls.isActive.disable();
        this.isEditing = false;

        // Actualizamos la señal con los nuevos datos
        this.user.set({ ...this.user(), ...this.userForm.value });
      },
      error: (err) => console.error('Error al guardar usuario', err)
    });
  }

  // -----------------------------
  // Alternar edición
  // -----------------------------
  toggleEdit() {
    Swal.fire({
      title: '¿Quieres editar tu usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Solo si confirma
        this.isEditing = true;
        this.userForm.enable();
        this.userForm.controls.roleName.disable();
        this.userForm.controls.isActive.disable();
      }
    });
  }


  miForm = new FormGroup({
    newPassword: new FormControl("", [Validators.required, Validators.minLength(6)]),
    confirmNewPassword: new FormControl("", [Validators.required])
  });



  isPassword = false;

  togglePassword() {
    Swal.fire({
      title: '¿Quieres cambiar la contraseña?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Solo si confirma
        this.isPassword = true;
        this.miForm.enable();
      }
    });
  }
  togglePasswordCacelar() {
    this.isPassword = false;
    this.miForm.reset();     // limpia los valores
    this.miForm.disable();   // desactiva los campos
  }


  changeNewPassword() {
    console.log('Inicio changeNewPassword');

    // 1️⃣ Validar coincidencia de nuevas contraseñas
    const { newPassword, confirmNewPassword } = this.miForm.value;
    console.log('Valores del formulario:', { newPassword, confirmNewPassword });

    if (newPassword !== confirmNewPassword) {
      console.error('Las contraseñas nuevas no coinciden');
      Swal.fire('Error', 'Las contraseñas nuevas no coinciden', 'error');
      return;
    }

    // 2️⃣ Obtener token del localStorage
    const token = localStorage.getItem('token');
    console.log('Token en localStorage:', token);
    if (!token) {
      console.error('No hay token en localStorage');
      Swal.fire('Error', 'No hay sesión activa', 'error');
      return;
    }

    // 3️⃣ Preparar datos para el servicio
    console.log('Llamando a changePasswordService con:', { token, newPassword });

    this.changePasswordService.changePassword(token, newPassword!).subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res);
        Swal.fire('Éxito', res.message || 'Contraseña cambiada exitosamente', 'success');
        this.togglePasswordCacelar();
      },
      error: (err) => {
        console.error('Error del backend:', err);
        const mensaje = err?.error?.message || 'No se pudo cambiar la contraseña';
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }


}
