import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '../../../services/exam-service';

@Component({
  selector: 'app-exam-form',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './exam-form.html',
  styleUrl: './exam-form.css'
})
export class ExamForm implements OnInit {
  ExamId: any;
  Exam:any;

  constructor(
    private examService: ExamService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {}
 ngOnInit(): void {
   this.activatedRoute.paramMap.subscribe({
      next:(params)=>{
      this.ExamId = params.get('id');
      this.ExamForm.patchValue({
        title:'',
        description:'',
        duration:'',
        
      });
      },
      error:(error)=>{
        console.log(error);
      }
    });
    if (this.ExamId!='0') {
       this.examService.GetExamById(this.ExamId).subscribe({
        next:(response)=>{
          this.Exam =response;
          
            if (this.Exam) {
              this.ExamForm.patchValue({ // to fill the form fields with the product data to update
                title: this.Exam.title,
                description: this.Exam.description,
                duration: this.Exam.duration,
                
              });
            }

        },
        error:(error)=>{console.log(error)}
      });
    
    }
  }
  ExamForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required,Validators.min(15)]),

  });

  get getTitle() {
    return this.ExamForm.controls['title'];
  }
  

  get getDescription() {
    return this.ExamForm.controls['description'];
  }
   

  get getDuration() {
    return this.ExamForm.controls['duration'];
  }


 ExamHandler() {
    if (this.ExamForm.valid) {
      if (this.ExamId!=0) {
        // Update existing exam
        this.examService.EditExam( this.ExamForm.value,this.ExamId).subscribe({
          next:()=>{
            this.examService.notifyExamsChanged(); // Notify list to update
            this.router.navigate(['/exams'])
          },
          error:(error)=>{alert(error.message)}
        });
      } else {
        // Add new exam

        this.examService.CreateExam( this.ExamForm.value ).subscribe({
          next:()=>{
                  this.examService.notifyExamsChanged(); // Notify list to update
                  this.router.navigate(['/exams']);

          },
          error:(error)=>{alert(error.message)}
        });
      }

      // this.router.navigate(['/exams']); // Remove this line, navigation is handled above
    } else {
      console.log(this.ExamForm.errors);
    }
  }
}
