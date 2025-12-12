import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IUser } from '../models/iuser';
import { Auth } from './auth';

@Injectable({ providedIn: 'root' })
export class UserService {
  // private apiUrl = 'https://exampro.runasp.net/api/Auth';
    private apiUrl = 'https://localhost:7233/api/Auth';

  constructor(private http: HttpClient, private auth: Auth) {}
  getCurrentUser(): Observable<any> {
      let headers=this.auth.getheaders();
        // return this.http.get(`${this.apiUrl}/me/username`, { headers,withCredentials:true });


    return this.http.get<{ username: string, role?: string }>(`${this.apiUrl}/me/username`, { headers, withCredentials:true }).pipe(
      map(res => ({ id: '', userName: res.username, phoneNumber: '', role: res.role }))
    );
  }
}
