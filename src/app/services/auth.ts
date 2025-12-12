import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // private apiUrl = 'https://exampro.runasp.net/api/Auth'; 
  private apiUrl = 'https://localhost:7233/api/Auth';
 headers:any;
 userEmail!:string;
  constructor(private http: HttpClient,private router:Router) {}

  getheaders(): HttpHeaders | undefined {
    const token = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token[2]}`);
    }
    return undefined;
  }


  

  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }
  validateOtp(otpCode:any, email:string):Observable<any>{
        return this.http.post(`${this.apiUrl}/validate-otp`, {otpCode,email});
  }

  resendOtp(userEmail:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/resend-otp?userEmail=${userEmail}`);
  }
 login(credentials: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials)
  //get token from api and save it in cookie
    .pipe(
      tap((res: any) => {
        const token = res.token;
        const userRole= res.userRole;

        localStorage.setItem('userRole',userRole);
        // Save to cookie for 1 hour
        const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
        document.cookie = `token=${token}; expires=${expires}; path=/`;
      })
    );
}


isLoggedIn():boolean{
    let userRole= document.cookie.match(new RegExp('(^| )UserRole=([^;]+)'));
    if(userRole)
        localStorage.setItem('userRole',userRole[2]);
 
  return !! this.getheaders();
}

logout():void {
  localStorage.clear();  
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}


}
