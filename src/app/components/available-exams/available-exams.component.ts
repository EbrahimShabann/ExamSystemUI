import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  loading = true;

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit() {
    this.examService.getAvailableExams().subscribe({
      next: (exams) => {
        this.availableExams = exams;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  startExam(exam: any) {
    if (!exam.submitted) {
      this.router.navigate(['/exam', exam.id]);
    }
  }
}
