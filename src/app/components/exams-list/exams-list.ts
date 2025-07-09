import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ExamService } from '../../services/exam-service';
import { IExam } from '../../models/iexam';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-exams-list',
  imports: [RouterLink],
  templateUrl: './exams-list.html',
  styleUrl: './exams-list.css'
})
export class ExamsList implements OnInit, OnDestroy {
  constructor(private ExamService:ExamService,private router :Router,
              private cdr : ChangeDetectorRef
  ){ }

  Exams:IExam[]=[];
  private examsChangedSub!: Subscription;

  ngOnInit(): void {
    this.loadExams();

    this.examsChangedSub = this.ExamService.examsChanged$.subscribe(() => {
      this.loadExams();
    });
  }

  ngOnDestroy(): void {
    if (this.examsChangedSub) {
      this.examsChangedSub.unsubscribe();
    }
  }

  loadExams() {
    this.ExamService.GetAllExams().subscribe({
      next:(response)=>{
        this.Exams=response;
        this.cdr.detectChanges();
      },
      error:(error)=>{
        console.log(error);
      }
    });
  }
 
  delete(id:number){
      const confirmed = confirm('Are you sure?');
    
      if(id!=0||id!=undefined){
        if(confirmed){
              this.ExamService.DeleteExam(id).subscribe({
                next:(res)=>{
                  console.log(res);
                    this.ExamService.notifyExamsChanged(); // Notify list to update
         
                },
                error:(error)=>console.log(error)
              });
             
      }
      }
     
  }

}
