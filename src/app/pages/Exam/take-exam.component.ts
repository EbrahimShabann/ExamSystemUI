import { Component, OnInit } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router
  ) {
    this.form = this.fb.group({
      answers: this.fb.array([])
    });
  }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    this.examService.getExamQuestions(this.examId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.initForm();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  initForm() {
    const answersArray = this.form.get('answers') as FormArray;
    this.questions.forEach(q => {
      if (q.type === 'MCQ') {
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
    this.examService.submitExam(this.examId, payload).subscribe({
      next: () => {
        alert('Exam submitted successfully!');
        this.router.navigate(['/results']);
      },
      error: () => {
        this.submitting = false;
        alert('Submission failed. Try again.');
      }
    });
  }
}
