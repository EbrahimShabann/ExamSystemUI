import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam-service';

@Component({
  selector: 'app-available-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './available-exams.component.html',
  styleUrls: ['./available-exams.component.css']
})
export class AvailableExamsComponent implements OnInit {
  availableExams: any[] = [];
  studentResults: any[] = [];
  loading = true;
  resultsLoading = true;

  constructor(private examService: ExamService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.examService.getAvailableExams().subscribe({
      next: (response) => {
        let exams: any[] = [];
        if (response && typeof response === 'object' && 'exams' in response) {
          exams = Array.isArray((response as any).exams) ? (response as any).exams : [];
        } else if (Array.isArray(response)) {
          exams = response;
        }
        // Filter out exams that are in studentResults
        this.examService.getStudentResults().subscribe({
          next: (results) => {
            this.studentResults = results;
            const takenExamIds = new Set(results.map((r: any) => r.examId || r.ExamId));
            this.availableExams = exams.filter(e => !takenExamIds.has(e.id || e.Id));
            this.loading = false;
            this.resultsLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.availableExams = exams;
            this.loading = false;
            this.resultsLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startExam(exam: any) {
    console.log('Exam ID:', exam.id, exam); // Debug: check the ID being passed
    this.router.navigate(['/exams', exam.id]);
  }
}
