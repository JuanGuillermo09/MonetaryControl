import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/Login`; 

  // Login del cliente
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { 
      Email: email, 
      Password: password 
    }).pipe(
      tap((response: any) => {
        // Guardar los datos que devuelve el backend
        localStorage.setItem('token', response.token);
        localStorage.setItem('userName', response.userName);
        localStorage.setItem('email', response.email);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userRolesId', response.userRolesId.toString());
        localStorage.setItem('roleName', response.roleName);

        console.log('Login exitoso:', response.userName, 'Rol:', response.roleName);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('roleName');
  }
}
