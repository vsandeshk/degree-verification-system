import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface Endorsement {
  type: string;
  reason: string;
  id: string;
  date: string;
}

export interface StudentData {
  degree_id: string;
  user_id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  degree_title: string;
  degree_programme: string;
  degree_class: string;
  completion_year: string;
  tr_date: string;
  vice_chancellor: Endorsement;
  pro_chancellor: Endorsement;
  active_status: boolean;
}

@Component({
  selector: 'app-exam-view-students',
  templateUrl: './exam-view-students.component.html',
  styleUrls: ['./exam-view-students.component.css']
})
export class ExamViewStudentsComponent implements OnInit {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  displayedColumns: string[] = ['student_id', 'student_name', 'degree_title', 'degree_programme', 'completion_year', 'action'];
  dataSource: MatTableDataSource<StudentData>;

  spin: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.spin = false;
  }

  setTableData(results): void {
    this.dataSource = null;
    this.dataSource = new MatTableDataSource(results);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    let role = localStorage.getItem("role");

    if (role != "EX") {
      this.router.navigate(['login'])
    }
    this.getStudents();
  }

  getStudents(): void {

    this.authService.getAllStudents().subscribe(results => {
      this.setTableData(results);
    }, error => {
      alert(error.error);
    });
  }

  viewStudent(student_id): void {
    localStorage.setItem("student_id", student_id);
    this.router.navigate(['view-student']);
  }

  deleteStudent(student_id): void {
    this.spin = true;
    this.authService.deleteStudent(student_id).subscribe(results => {
      alert(results);
      location.reload();
    }, error => {
      alert(error.error);
    });
  }


}
