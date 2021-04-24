import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';

export interface Endorsement {
  type: string;
  reason: string;
  endorser_id: string;
  date: string;
}

@Component({
  selector: 'app-degree-view-student',
  templateUrl: './degree-view-student.component.html',
  styleUrls: ['./degree-view-student.component.css']
})
export class DegreeViewStudentComponent implements OnInit {

  formGroup: FormGroup;
  student_id: string;
  complete: boolean;
  partial: boolean;
  rejected: boolean;


  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  displayedColumns: string[] = ['endorser', 'endorser_id', 'type', 'reason', 'date'];
  dataSource: MatTableDataSource<Endorsement>;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  setTableData(results): void {
    let st_data = [];
    let temp_obj = results.pro_chancellor;
    temp_obj.endorser = "Pro Chancellor";
    st_data.push(temp_obj);
    temp_obj = results.vice_chancellor
    temp_obj.endorser = "Vice Chancellor";
    st_data.push(temp_obj);
    this.dataSource = null;

    if (results.pro_chancellor.type == "Rejected" || results.vice_chancellor.type == "Rejected") {
      this.complete = false;
      this.partial = false;
      this.rejected = true;
    } else if (results.pro_chancellor.type == "" || results.vice_chancellor.type == "") {
      this.complete = false;
      this.partial = true;
      this.rejected = false;

    }


    this.dataSource = new MatTableDataSource(st_data);
  }


  ngOnInit(): void {
    this.student_id = localStorage.getItem("student_id");
    if (this.student_id == null || this.student_id == "") {
      this.router.navigate(['']);
    }
    this.complete = true;
    this.partial = false;
    this.rejected = false;
    this.getStudent(this.student_id);
    this.initForm();

  }

  initForm() {
    this.formGroup = new FormGroup({
      degree_id: new FormControl('', [Validators.required]),
      user_id: new FormControl('', [Validators.required]),
      student_id: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      degree_title: new FormControl('', [Validators.required]),
      degree_programme: new FormControl('', [Validators.required]),
      degree_class: new FormControl('', [Validators.required]),
      completion_year: new FormControl('', [Validators.required]),
      tr_date: new FormControl('', [Validators.required]),
      active_status: new FormControl('', [Validators.required]),
      vice_chancellor: new FormGroup({
        endorser_id: new FormControl('', []),
        type: new FormControl('', []),
        reason: new FormControl('', []),
        date: new FormControl('', []),
      }),
      pro_chancellor: new FormGroup({
        endorser_id: new FormControl('', []),
        type: new FormControl('', []),
        reason: new FormControl('', []),
        date: new FormControl('', []),
      })
    });
  }


  getStudent(student_id) {
    this.authService.getStudentDegree(student_id).subscribe(results => {
      console.log(results);
      this.formGroup.setValue(results);
      this.setTableData(results)

    }, error => {
      alert(error.error);
    });
  }

}
