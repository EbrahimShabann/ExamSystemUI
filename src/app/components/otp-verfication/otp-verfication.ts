import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-otp-verfication',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './otp-verfication.html',
  styleUrl: './otp-verfication.css'
})
export class OtpVerfication implements OnInit {
@Input() userEmail: string = '';
isSubmitting:boolean=false;

constructor(private authService:Auth,private router:Router,private route: ActivatedRoute){}
ngOnInit() {
  this.userEmail = this.authService.userEmail;
}

  message = '';
 

  otpForm = new FormGroup({
    otpCode: new FormControl('', [Validators.required]) // 6 digits
   
  })



  get otpCode(){
     return this.otpForm.get('otpCode')?.value;
  }
   

   validate() {
    if (this.otpForm.invalid) return;
    this.isSubmitting=true;
    this.message = '';
    console.log('valid form');
    this.authService.validateOtp(this.otpCode,this.userEmail).subscribe({
      next: (res) => {
        console.log(res);
        this.message = 'Validation passed!';
        alert(this.message);
         this.router.navigate(['/account/login']); //, { queryParams: { email: this.userEmail } }
  
      },
      error: err => {
        console.log(err);
        this.message = err.error?.message || 'validation failed!';
         alert(this.message);
         this.isSubmitting=false;
         this.otpForm.reset();

      }
    });
  }

  resendCode(){
    // console.log(this.userEmail);
    this.authService.resendOtp(this.userEmail).subscribe({
      next:()=>alert("OTP was resent to your email"),
      error:err=>alert(err.message)
    });
  }
}
