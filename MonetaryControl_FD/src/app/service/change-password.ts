import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangePassword {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ChangePassword`;

  changePassword(token: string, newPassword: string) {
    const body = {
      token: token,
      newPassword: newPassword
    };

    return this.http.post<{ message: string }>(this.apiUrl, body);
  }


}
