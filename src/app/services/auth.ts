

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'https://localhost:7233/api/Auth'; 
 headers:any;

  constructor(private http: HttpClient,private router:Router) {}

  getheaders():string|null{
    //get token from cookie then create header ro send to api with request for authorization
    const token = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    console.log(token);
    if(token){
    this.headers = new HttpHeaders().set("Authorization", `Bearer ${token[2]}`);
    }
    return this.headers?this.headers:null;
  }

  
  

  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

 login(credentials: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials)
  //get token from api and save it in cookie
    .pipe(
      tap((res: any) => {
        const token = res.token;

        // Save to cookie for 1 hour
        const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
        document.cookie = `token=${token}; expires=${expires}; path=/`;
      })
    );
}
isLoggedIn():boolean{
  return !! this.getheaders();
}

logout():void {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}


}
