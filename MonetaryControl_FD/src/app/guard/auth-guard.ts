import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../service/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true; // Usuario logueado, permite acceso
  } else {
    router.navigate(['/login']); // Redirige al login
    return false; // Bloquea la ruta
  }
};
