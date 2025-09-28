import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Home {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Expense`;

  // Función para obtener todos los home
  ListExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ListExpenses`);
  }

  // Función para obtener un home por ID
  ListExpenseId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ListExpenses/${id}`);
  }

  // Función para agregar un nuevo home
  CreateExpense(createexpense: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreateExpenses`, createexpense);
  }

  // Función para editar un home existente por ID
  UpdateExpense(id: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateExpenses/${id}`, dto);
  }

  // Función para eliminar un home por ID
  DeleteExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteExpenses/${id}`);
  }


}
