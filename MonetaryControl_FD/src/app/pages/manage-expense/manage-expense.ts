import { Component, inject, ViewChild } from '@angular/core';
import { CustomInput } from '../../utils/custom-input/custom-input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CustomTitleHelpLink } from '../../utils/custom-title-help-link/custom-title-help-link';
import { Home } from '../../service/home';


import { AngularSignaturePadModule, SignaturePadComponent, NgSignaturePadOptions } from '@almothafar/angular-signature-pad';

import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Component({
  selector: 'app-manage-expense',
  imports: [CustomInput, ReactiveFormsModule, MatCardModule, CustomTitleHelpLink, CommonModule, AngularSignaturePadModule],
  templateUrl: './manage-expense.html',
  styleUrl: './manage-expense.scss',

})
export class ManageExpense {

  // Imagen
  previewUrl: string | ArrayBuffer | null = null;
  imagenBase64: string | null = null;

  private expenseService = inject(Home);
  private router = inject(Router);

  @ViewChild('signaturePad') signaturePad!: SignaturePadComponent;

  signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 1,
    maxWidth: 1,
  };

  // Función para limpiar la firma
  clearSignature() {
    this.signaturePad.clear();
  }

  clearForm() {
    this.userForm.reset();
  }


  // -----------------------------
  // Selección de archivo
  // -----------------------------
  onFileSelected(event: any) {
    const file: File = event.target.files[0]!;

    if (file) {
      // Guardamos el File en el form
      this.userForm.patchValue({ invoice: file });

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



  userForm = new FormGroup({
    description: new FormControl(""),
    category: new FormControl(""),
    amount: new FormControl(), // Nuevo campo de salario
    signature: new FormControl<File | null>(null),
    invoice: new FormControl<File | null>(null),

  });


  // -----------------------------
  // Guardar usuario
  // -----------------------------
  saveExpense() {
    const idStr = localStorage.getItem('userId');
    if (!idStr) return console.error('No hay userId en localStorage');
    const id = Number(idStr);
    if (isNaN(id)) return console.error('ID inválido:', idStr);

    const formData = new FormData();
    formData.append('UserId', String(id));
    formData.append('description', this.userForm.value.description ?? '');
    formData.append('category', this.userForm.value.category ?? '');
    formData.append('amount', String(this.userForm.value.amount ?? 0));

    // 🔹 Capturar firma del signaturePad
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      const signatureBase64 = this.signaturePad.toDataURL('image/png');
      const signatureBlob = this.base64ToBlob(signatureBase64.split(',')[1], 'image/png');
      formData.append('signature', signatureBlob, `signature_${id}.png`);
    } else {
      console.warn('No se dibujó ninguna firma');
    }

    // 🔹 Adjuntar factura si existe
    const invoiceFile = this.userForm.value.invoice;
    if (invoiceFile) {
      formData.append('invoice', invoiceFile, invoiceFile.name);
    }

    console.log('==== FormData final a enviar ====');
    formData.forEach((value, key) => console.log(key, value));

    this.expenseService.CreateExpense(formData).subscribe({
      next: (res) => {
        console.log('Gasto guardado correctamente', res);

        // 🔹 Resetear formulario y limpiar firma
        this.userForm.reset();
        if (this.signaturePad) this.signaturePad.clear();

        // 🔹 Mostrar alerta con opciones
        Swal.fire({
          title: '¡Guardado!',
          text: 'El gasto se guardó correctamente',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Ir al Home',
          cancelButtonText: 'Seguir aquí'
        }).then((result) => {
          if (result.isConfirmed) {
            // 🔹 Redirigir a Home
            this.router.navigate(['/home']);
          }
          // Si cancela, se queda en la misma vista
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'Ocurrió un problema al guardar el gasto',
        });
        console.error('Error al guardar gasto', err);
      }
    });
  }



}
