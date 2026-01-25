import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRole {


  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/UserRole`;

  // Función para obtener todos los UserRole
  ListUserRole(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ListUserRoles`);
  }

  // Función para obtener un UserRole por ID
  ListUserRoleId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ListUserRole/${id}`);
  }

  // Función para agregar un nuevo UserRole
  CreateUserRole(createuserrole: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreateUserRole`, createuserrole);
  }

  // Función para editar un UserRole existente por ID
  UpdateUserRole(id: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateUserRole/${id}`, dto);
  }

  // Función para eliminar un UserRole por ID
  DeleteUserRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteUserRole/${id}`);
  }



}
