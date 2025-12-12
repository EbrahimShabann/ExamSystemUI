import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports:[FormsModule,CommonModule,ReactiveFormsModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  message = '';

  constructor(private fb: FormBuilder, private auth: Auth,private router:Router, private cdr:ChangeDetectorRef) {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.message = '';
    this.auth.userEmail=this.registerForm.get('email')?.value;
    this.auth.register(this.registerForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.message = res.message;
        alert(res.message);
        this.loading = false;
        if(res.success){
          this.registerForm.reset();
          this.router.navigate(['/otpVerfication']);  
        }
       
        
      },
      error: err => {
        this.message = err.error?.message || 'Registration failed!';
         alert(this.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
