import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Perfil {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/User`; 

    // Función para obtener todos los Usuarios
  ListUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ListUsers`);
  }

  // Función para obtener un Usuario por ID
  ListUserId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ListUser/${id}`);
  }

  // Función para agregar un nuevo Usuario
  CreateUser(createuser: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreateUser`, createuser);
  }

  // Función para editar un Usuario existente por ID
  UpdateUser(id: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateUser/${id}`, dto);
  }

  // Función para eliminar un Usuario por ID
  DeleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteUser/${id}`);
  }

  
}
