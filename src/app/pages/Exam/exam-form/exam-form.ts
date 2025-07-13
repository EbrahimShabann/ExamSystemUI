import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
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
    private cdr:ChangeDetectorRef,
   
  ) {}
 ngOnInit(): void {
   this.activatedRoute.paramMap.subscribe({
      next:(params)=>{
      this.ExamId = params.get('id');
      this.ExamForm.patchValue({
        title:'',
        description:'',
        duration:'',
        questions:[]
        
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
              this.getQuestions.clear();

  this.Exam.questions.forEach((question: any) => {
    const questionGroup = new FormGroup(
      {
        QuestionText: new FormControl(question.questionText, Validators.required),
        QuestionType: new FormControl(question.questionType, Validators.required),
        choices: new FormArray([]),
      },
      { validators: this.validateChoicesIfNeeded }
    );

    // Fill choices for each question
    question.choices.forEach((choice: any) => {
      const choiceGroup = new FormGroup({
        ChoiceText: new FormControl(choice.choiceText, Validators.required),
        IsCorrect: new FormControl(choice.isCorrect, Validators.required),
      });
      (questionGroup.get('choices') as FormArray).push(choiceGroup);
    });

    this.getQuestions.push(questionGroup);
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
    questions:new FormArray([]),
    

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

  get getQuestions():FormArray{
    return this.ExamForm.get('questions') as FormArray;
  }


addQuesField(){
 const quesGroup = new FormGroup(
  {
  QuestionText :new FormControl('',[Validators.required]),
  QuestionType :new FormControl('',[Validators.required]),
  choices:new FormArray([]),
 },

 {
  validators:this.validateChoicesIfNeeded   //custom validation
 }

)

 this.getQuestions.push(quesGroup);
}

removeQuesField(index:number){
  this.getQuestions.removeAt(index);
}

getChoices(quesIndex:number):FormArray{
return this.getQuestions.at(quesIndex).get('choices') as FormArray;
}

addChoice(quesIndex:number){
  const choices= this.getChoices(quesIndex);

  const choiceGroup= new FormGroup({
    ChoiceText:new FormControl('',[Validators.required]),
    IsCorrect:new FormControl(false,[Validators.required]),

  })
  choices.push(choiceGroup);
}

//if the ques is mcq and the user try to submit without adding choices
validateChoicesIfNeeded(group:AbstractControl):ValidationErrors|null
{
  const quesType= group.get('QuestionType')?.value;
  const choices = group.get('choices') as FormArray;
  if((quesType==='MCQ' || quesType==="TF") && choices.length<2)
  {
    return{missingChoices:true};
  }
  return null;
}

removeChoiceField(quesIndex:number,choiceIndex:number){
  const choices= this.getChoices(quesIndex);
  choices.removeAt(choiceIndex);
}


 ExamHandler() {

    if (this.ExamForm.valid) {
      if (this.ExamId!=0) {
        // Update existing exam
        this.examService.EditExam( this.ExamForm.value,this.ExamId).subscribe({
          next:(res)=>{
            console.log(res)
            this.examService.notifyExamsChanged(); // Notify list to update
            this.router.navigate(['/exams'])
          },
          error:(error)=>{
             console.log(this.ExamForm.value)
            alert(error.message)
           
          }
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
