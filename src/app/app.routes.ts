import { authGuard } from './services/auth-guard';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ExamForm } from './pages/Exam/exam-form/exam-form';
import { Account } from './pages/account/account';
import { NotFound } from './pages/not-found/not-found';
import { Exams } from './pages/Exam/exams';
import { AvailableExamsComponent } from './components/available-exams/available-exams.component';
import { TakeExamComponent } from './pages/Exam/take-exam.component';

export const routes: Routes = [
    { path: '', component: AvailableExamsComponent, canActivate: [authGuard] },
    { path: 'exam/:id', component: TakeExamComponent, canActivate: [authGuard] },
    { path: 'exams', component: Exams, canActivate: [authGuard] },
    { path: 'exams/:id/upsert', component: ExamForm, canActivate: [authGuard] },
    { path: 'account', component: Account,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent }
        ] },
    { path: '**', component: NotFound },
];
