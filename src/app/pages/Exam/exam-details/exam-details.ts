import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from './../../../services/exam-service';

@Component({
  selector: 'app-exam-details',

  templateUrl: './exam-details.html',
  styleUrl: './exam-details.css'
})

export class ExamDetails implements OnInit{
ExamId!:string| null;
Exam:any;
constructor(private activatedRoute:ActivatedRoute, private ExamService: ExamService
            , private cdr:ChangeDetectorRef
){}
  ngOnInit(): void {
    this.ExamId= this.activatedRoute.snapshot.paramMap.get('id');
    this.ExamService.GetExamById(this.ExamId).subscribe({
      next:(response)=>{
        this.Exam=response;
            this.cdr.detectChanges();

      },
      error:(error)=>{
        console.log(error);
      }
    });
  }
}
