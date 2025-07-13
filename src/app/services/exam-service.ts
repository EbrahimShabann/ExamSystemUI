import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  headers:any;
    constructor(private http: HttpClient,private auth:Auth) {
        this.headers=this.auth.getheaders();
    }

   
   private apiUrl = 'https://localhost:7233/api/Exam'; 

   private examsChangedSource = new BehaviorSubject<void>(undefined);
   examsChanged$ = this.examsChangedSource.asObservable();

   notifyExamsChanged() {
     this.examsChangedSource.next();
   }

  CreateExam(data: any): Observable<any> {
    console.log(this.headers);
    return this.http.post(`${this.apiUrl}`, data, { headers: this.headers });
  }

  GetAllExams(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllExams`);
  }
  GetExamById(id:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  EditExam(data:any,id:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`,data,{ headers: this.headers });
  }
   DeleteExam(id:any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers: this.headers });
  }

  getAvailableExams(): Observable<any[]> {
    return this.http.get<any[]>(`/api/exams/available`, { headers: this.headers });
  }

  getExamQuestions(examId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/exams/${examId}/questions`, { headers: this.headers });
  }

  submitExam(examId: string, payload: any): Observable<any> {
    return this.http.post(`/api/exams/${examId}/submit`, payload, { headers: this.headers });
  }
}
