import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Alert {

  // ========================================
  // MÉTODOS GENÉRICOS DE ALERTAS
  // ========================================

  // Alertas de éxito
  success(title: string, text?: string, timer?: number) {
    const options: SweetAlertOptions = {
      icon: 'success',
      title: title,
      text: text,
      showConfirmButton: true
    };

    if (timer) {
      options.timer = timer;
      options.showConfirmButton = false;
    }

    return Swal.fire(options);
  }

  // Alertas de error
  error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text
    });
  }

  // Alertas de advertencia
  warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text
    });
  }

  // Alertas de información
  info(title: string, text?: string) {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text
    });
  }

  // Alertas de confirmación
  confirm(title: string, text?: string, confirmText?: string, cancelText?: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText || 'Sí, continuar',
      cancelButtonText: cancelText || 'Cancelar'
    });
  }

  // ========================================
  // ALERTAS DE USUARIOS (CREAR/EDITAR/ELIMINAR)
  // ========================================

  // Cuando se crea un usuario exitosamente
  userCreated() {
    return this.success('¡Usuario Creado!', 'El usuario se registró correctamente', 2000);
  }

  // Cuando se actualiza un usuario exitosamente
  userUpdated() {
    return this.success('¡Guardado!', 'El usuario se actualizó correctamente', 2000);
  }

  // Cuando se elimina un usuario exitosamente
  userDeleted() {
    return this.success('¡Eliminado!', 'El usuario se eliminó correctamente', 2000);
  }

  // Confirmar edición de perfil
  confirmEditProfile() {
    return this.confirm(
      '¿Quieres editar tu usuario?',
      '',
      'Sí, editar',
      'Cancelar'
    );
  }

  // Confirmar cambio de contraseña
  confirmChangePassword() {
    return this.confirm(
      '¿Quieres cambiar la contraseña?',
      '',
      'Sí, cambiar',
      'Cancelar'
    );
  }

  // Error al crear usuario
  createUserError(err?: any) {
    return this.error('Error al crear', err?.error?.message || 'Ocurrió un problema al crear el usuario');
  }

  // Error al actualizar usuario
  updateUserError() {
    return this.error('Error al guardar', 'Ocurrió un problema al guardar perfil');
  }

  // Error al eliminar usuario
  deleteUserError() {
    return this.error('Error al eliminar', 'Ocurrió un problema al eliminar el usuario');
  }

  // ========================================
  // ALERTAS DE GASTOS/EXPENSAS
  // ========================================

  // Cuando se elimina un gasto exitosamente
  expenseDeleted() {
    return this.success('¡Eliminado!', 'El gasto se eliminó correctamente', 2000);
  }

  // Cuando se guarda un gasto exitosamente
  expenseSaved() {
    return this.success('¡Guardado!', 'El gasto se guardó correctamente');
  }

  // Cuando se guarda un gasto con opción de ir al home
  expenseSavedWithNavigation() {
    return this.confirm(
      '¡Guardado!',
      'El gasto se guardó correctamente',
      'Ir al Home',
      'Seguir aquí'
    );
  }

  // Error al guardar gasto
  expenseSavedError() {
    return this.error('Error al guardar', 'Ocurrió un problema al guardar el gasto');
  }

  // Error al eliminar gasto
  deleteExpenseError() {
    return this.error('Error al eliminar', 'Ocurrió un problema al eliminar el gasto');
  }

  // ========================================
  // ALERTAS DE PRODUCTOS/ITEMS (MÚLTIPLES GASTOS)
  // ========================================

  // Cuando se actualiza un producto
  productUpdated() {
    return this.success('Actualizado', 'Producto editado correctamente');
  }

  // Cuando se agrega un producto
  productAdded() {
    return this.success('Agregado', 'Producto agregado a la lista');
  }

  // Cuando se elimina un producto
  productDeleted() {
    return this.success('Eliminado', 'El producto fue eliminado');
  }

  // Cuando no hay productos para guardar
  noProducts() {
    return this.warning('Sin productos', 'Agrega al menos un producto antes de guardar');
  }

  // ========================================
  // ALERTAS DE AUTENTICACIÓN (LOGIN/LOGOUT)
  // ========================================

  // Bienvenida al iniciar sesión
  welcome(userName: string) {
    return this.success('¡Bienvenido!', `${userName}`);
  }

  // Despedida al cerrar sesión
  goodbye(userName: string) {
    return this.info('¡Hasta luego!', `${userName}`);
  }

  // Error de credenciales inválidas
  invalidCredentials() {
    return this.error('Credenciales inválidas', 'Por favor corregir');
  }

  // ========================================
  // ALERTAS DE VALIDACIÓN Y ERRORES GENERALES
  // ========================================

  // Campos vacíos en formulario
  emptyFields() {
    return this.warning('Campos vacíos', 'Por favor completa todos los campos');
  }

  // Contraseñas que no coinciden
  passwordsNotMatch() {
    return this.error('Error', 'Las contraseñas nuevas no coinciden');
  }

  // Email ya registrado
  emailAlreadyRegistered() {
    return this.error('Email ya registrado', 'El correo electrónico ya está en uso. Por favor use otro email.');
  }

  // Formulario incompleto
  incompleteForm() {
    return this.warning('Formulario incompleto', 'Por favor completa todos los campos');
  }

  // Sin sesión activa
  noActiveSession() {
    return this.error('Error', 'No hay sesión activa');
  }

  // Contraseña cambiada exitosamente
  passwordChangedSuccess(message?: string) {
    return this.success('Éxito', message || 'Contraseña cambiada exitosamente');
  }

  // Error al cambiar contraseña
  passwordChangeError(message?: string) {
    return this.error('Error', message || 'No se pudo cambiar la contraseña');
  }

  // ID inválido para mostrar detalles
  invalidId() {
    return this.warning('ID inválido', 'El usuario no tiene un ID válido para mostrar detalles');
  }

  // Error al cargar información
  loadingError() {
    return this.error('Error', 'No se pudo cargar la información');
  }

  // Error de conexión con el servidor
  connectionError() {
    return this.error('Error de conexión', 'No se pudo conectar con el servidor. Intente nuevamente.');
  }

  // Error al verificar email
  emailVerificationError() {
    return this.error('Error de conexión', 'No se pudo verificar el email. Intente nuevamente.');
  }

  // ========================================
  // ALERTAS DE CONFIRMACIÓN
  // ========================================

  // Confirmar eliminación de usuario
  confirmDeleteUser() {
    return this.confirm(
      '¿Estás seguro?',
      'Este usuario se eliminará de forma permanente',
      'Sí, eliminar',
      'Cancelar'
    );
  }

  // Confirmar eliminación de gasto
  confirmDeleteExpense() {
    return this.confirm(
      '¿Estás seguro?',
      'Este gasto se eliminará de forma permanente',
      'Sí, eliminar',
      'Cancelar'
    );
  }

  // Confirmar eliminación de producto
  confirmDeleteProduct() {
    return this.confirm(
      '¿Eliminar producto?',
      'Esta acción no se puede deshacer',
      'Sí, eliminar',
      'Cancelar'
    );
  }
}
