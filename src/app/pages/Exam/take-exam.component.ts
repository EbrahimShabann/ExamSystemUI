import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExamService } from '../../services/exam-service';
import { UserService } from '../../services/user-service';
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
  userRole: string | null = null;
  // Pagination
  currentPage = 1;
  pageSize = 5;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private examService: ExamService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      answers: this.fb.array([])
    });
  }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    // Get user role
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userRole = user.role || null;
        this.loadQuestions();
      },
      error: () => {
        this.userRole = null;
        this.loadQuestions();
      }
    });
  }

  loadQuestions() {
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
        this.initForm();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  initForm() {
    const answersArray = this.form.get('answers') as FormArray;
    answersArray.clear();
    this.questions.forEach(q => {
      if (q.type === 'MCQ' || q.type === 'TF') {
        answersArray.push(this.fb.group({ questionId: q.id, choiceId: [null, Validators.required] }));
      } else {
        answersArray.push(this.fb.group({ questionId: q.id, textAnswer: ['', Validators.required] }));
      }
    });
  }

  // Pagination helpers
  get pagedQuestions() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.questions.slice(start, start + this.pageSize);
  }
  get pagedAnswersArray() {
    const answersArray = this.form.get('answers') as FormArray;
    const start = (this.currentPage - 1) * this.pageSize;
    return Array.from({length: Math.min(this.pageSize, answersArray.length - start)}, (_, i) => start + i);
  }
  get totalPages() {
    return Math.ceil(this.questions.length / this.pageSize);
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
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
