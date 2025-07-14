import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExamService } from '../../services/exam-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css']
})
export class TakeExamComponent implements OnInit {
  examId: string = '';
  questions: any[] = [];
  form: FormGroup;
  loading = true;
  submitting = false;
  submitted = false;
  showResultButton = false;
  resultDetails: any = null; // Holds the result with correct answers after submission

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      answers: this.fb.array([])
    });
  }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    this.examService.getExamQuestions(this.examId).subscribe({
      next: (questions) => {
        // Map backend fields to frontend expected fields
        this.questions = questions.map((q: any) => ({
          id: q.id,
          text: q.questionText,
          type: q.questionType === 'MCQ' || q.questionType === 0 ? 'MCQ' : 
                q.questionType === 'TF' || q.questionType === 1 ? 'TF' : 'Text',
          choices: q.choices?.map((c: any) => ({
            id: c.id,
            text: c.choiceText
          })) || []
        }));
        console.log('Mapped questions:', this.questions);
        this.initForm();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  initForm() {
    const answersArray = this.form.get('answers') as FormArray;
    this.questions.forEach(q => {
      if (q.type === 'MCQ' || q.type === 'TF') {
        answersArray.push(this.fb.group({ questionId: q.id, choiceId: [null, Validators.required] }));
      } else {
        answersArray.push(this.fb.group({ questionId: q.id, textAnswer: ['', Validators.required] }));
      }
    });
  }

  submitExam() {
    if (this.form.invalid) return;
    if (!confirm('Are you sure you want to submit your answers?')) return;
    this.submitting = true;
    
    const payload = { answers: this.form.value.answers };
    console.log('Form payload:', JSON.stringify(payload, null, 2));
    console.log('Questions:', this.questions);
    this.examService.submitExam(this.examId, payload).subscribe({
      next: (result) => {
        alert('Exam submitted successfully!');
        this.submitted = true;
        this.showResultButton = true;
        this.resultDetails = result; // Expecting result to contain correct answers and user answers
        this.submitting = false;
        this.router.navigate(['/AvailableExams'])
        this.cdr.detectChanges();
      },
      error: () => {
        this.submitting = false;
        alert('Submission failed. Try again.');
        this.cdr.detectChanges();
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/']);
  }
}
