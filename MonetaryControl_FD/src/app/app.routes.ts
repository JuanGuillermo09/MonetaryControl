import { Routes } from '@angular/router';
import { authGuard } from './guard/auth-guard';
import { Login } from './auth/login/login';
import { Main } from './main/main';


export const routes: Routes = [
  // Ruta de login como principal (no necesita children)
  {
    path: 'login',
    component: Login
  },

  // Ruta para todo lo que está detrás del login
  {
    path: '',
    component: Main,
    children: [
      {
        path: 'recover-password',
        loadComponent: () => import('./auth/recover-password/recover-password').then((m) => m.RecoverPassword),
      },
      {
        path: 'change-password',
        loadComponent: () => import('./auth/change-password/change-password').then((m) => m.ChangePassword),
        canActivate: [authGuard]
      },
      {
        path: 'home',
        loadComponent: () => import('./main/home/home').then(m => m.Homes),
        canActivate: [authGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./main/profile/profile').then(m => m.Profile),
        canActivate: [authGuard]
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./main/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard]
      },
      {
        path: 'manage',
        loadComponent: () => import('./shared/manage-expense/manage-expense').then(m => m.ManageExpense),
        canActivate: [authGuard]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }
    ]
  },

  // Redirección al login si no hay ruta
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }


];
