import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Home } from '../../service/home';
import { MatTabsModule } from '@angular/material/tabs';

import { AngularSignaturePadModule, SignaturePadComponent, NgSignaturePadOptions } from '@almothafar/angular-signature-pad';

import { CommonModule } from '@angular/common';
import { Alert } from '../../service/alert';
import { Router, RouterLink } from '@angular/router';
import { CustomInput } from '../../utils/custom-input/custom-input';
import { CustomTitleHelpLink } from '../../utils/custom-title-help-link/custom-title-help-link';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-expense-items',
  imports: [CustomInput, ReactiveFormsModule, MatCardModule, CustomTitleHelpLink, CommonModule, AngularSignaturePadModule, MatTabsModule, MatIconModule, RouterLink],
  templateUrl: './expense-items.html',
  styleUrl: './expense-items.scss',

})
export class ExpenseItems {
isMultipleMode = false;

multiForm = new FormGroup({
  description: new FormControl(''),
  category: new FormControl(''),
  amount: new FormControl<number | null>(null),
});

products: { description: string; category: string; amount: number }[] = [];
editingIndex: number | null = null;
  // Imagen
  previewUrl: string | ArrayBuffer | null = null;
  imagenBase64: string | null = null;

  private expenseService = inject(Home);
  private router = inject(Router);
  private alertService = inject(Alert);

  @ViewChild('signaturePad') signaturePad!: SignaturePadComponent;

  signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 1,
    maxWidth: 1,
  };

  switchMode(multiple: boolean) {
  this.isMultipleMode = multiple;
}

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
        this.alertService.expenseSavedWithNavigation().then((result: any) => {
          if (result.isConfirmed) {
            // 🔹 Redirigir a Home
            this.router.navigate(['/home?view=expenses']);
          }
          // Si cancela, se queda en la misma vista
        });
      },
      error: (err) => {
        this.alertService.expenseSavedError();
        console.error('Error al guardar gasto', err);
      }
    });
  }

// -----------------------------
// AÑADIR PRODUCTO
// -----------------------------
addProduct() {
  const desc = this.multiForm.value.description?.trim();
  const cat = this.multiForm.value.category?.trim();
  const amt = this.multiForm.value.amount;

  if (!desc || !cat || amt == null) {
    this.alertService.emptyFields();
    return;
  }

  const newProduct = { description: desc, category: cat, amount: amt };

  if (this.editingIndex !== null) {
    this.products[this.editingIndex] = newProduct;
    this.editingIndex = null;
    this.alertService.productUpdated();
  } else {
    this.products.push(newProduct);
    this.alertService.productAdded();
  }

  this.multiForm.reset();
}

// -----------------------------
// EDITAR PRODUCTO
// -----------------------------
editProduct(index: number) {
  const p = this.products[index];
  this.multiForm.setValue({
    description: p.description,
    category: p.category,
    amount: p.amount,
  });
  this.editingIndex = index;
}

// -----------------------------
// ELIMINAR PRODUCTO
// -----------------------------
// ELIMINAR PRODUCTO
// -----------------------------
deleteProduct(index: number) {
  this.alertService.confirmDeleteProduct().then((res: any) => {
    if (res.isConfirmed) {
      this.products.splice(index, 1);
      this.alertService.productDeleted();
    }
  });
}

// -----------------------------
// GUARDAR TODOS EN LA BD
// -----------------------------
saveAllProducts() {
  if (this.products.length === 0) {
    this.alertService.noProducts();
    return;
  }

  const idStr = localStorage.getItem('userId');
  if (!idStr) return console.error('No hay userId en localStorage');
  const id = Number(idStr);

  const payload = this.products.map((p) => ({
    userId: id,
    description: p.description,
    category: p.category,
    amount: p.amount,
  }));

  // this.expenseService.CreateMultipleExpenses(payload).subscribe({
  //   next: () => {
  //     Swal.fire('Guardado', 'Todos los productos se guardaron correctamente', 'success');
  //     this.products = [];
  //   },
  //   error: (err) => {
  //     console.error('Error al guardar productos', err);
  //     Swal.fire('Error', 'No se pudieron guardar los productos', 'error');
  //   },
  // });
}

}
