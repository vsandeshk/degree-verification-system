import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Endorsement {
  type: string;
  reason: string;
  endorser_id: string;
  date: string;
}

export interface DialogData {
  type: string;
  reason: string;
}

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {

  formGroup: FormGroup;
  spin: boolean;
  edit: boolean;
  disabledFields: boolean;

  student_id: string;
  role: string;
  reason: string;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  displayedColumns: string[] = ['endorser', 'endorser_id', 'type', 'reason', 'date'];
  dataSource: MatTableDataSource<Endorsement>;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private authService: AuthService, public dialog: MatDialog) {
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
    console.log(st_data);

    this.dataSource = new MatTableDataSource(st_data);
  }

  ngOnInit(): void {
    this.edit = false;
    this.spin = false;
    this.disabledFields = false;
    this.student_id = localStorage.getItem("student_id");
    //  localStorage.removeItem("student_id");
    this.role = localStorage.getItem('role');

    if (this.student_id == null || this.student_id == "") {
      if (this.role == "EX") {
        this.router.navigate(['exam/view-students']);
      } else {
        this.router.navigate(['login']);
      }
    }
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
    this.disableFields();
  }

  enableFields() {

    let fieldsToEnable = ['first_name', 'last_name', 'degree_title', 'degree_programme', 'degree_class', 'completion_year']
    for (let i in fieldsToEnable) {
      let field = fieldsToEnable[i];
      this.formGroup.controls[field].enable();
    }

    this.edit = true;
  }

  disableFields() {
    for (let all in this.formGroup.controls) {

      this.formGroup.controls[all].disable();
    }
  }

  editStudentData() {
    if (this.formGroup.valid) {
      this.spin = true;
      let data = this.formGroup.value;
      data.student_id = this.student_id;
      this.authService.editStudent(data).subscribe(results => {
        alert(results);
        this.spin = false;
        localStorage.setItem("student_id", this.student_id);
        location.reload();
      }, error => {
        alert(error.error);
      });
    }

  }

  isEx() {
    return this.authService.isEx();
  }

  isEDR() {
    return this.authService.isEDR();
  }

  getStudent(student_id) {
    this.authService.getStudent(student_id).subscribe(results => {
      console.log(results);
      this.formGroup.setValue(results);
      this.setTableData(results)

    }, error => {
      alert(error.error);
    });
  }

  endorseStudentDegree() {
    let reqData = { student_id: this.student_id, e_type: "Approved", reason: "" }
    this.endorseStudent(reqData);
  }

  endorseStudent(data) {
    this.spin = true;
    this.authService.endorseStudentDegree(data).subscribe(results => {
      alert(results);
      this.spin = false;
      localStorage.setItem("student_id", this.student_id);
      location.reload();
    }, error => {
      alert(error.error);
    });
  }

  openEndorseDialog() {
    const dialogRef = this.dialog.open(DialogContent, {
      width: '30%',
      data: { reason: this.reason }
    });

    dialogRef.afterClosed().subscribe(result => {

      let reqData = { student_id: this.student_id, e_type: "Rejected", reason: result.reason };
      this.endorseStudent(reqData);
    });

  }

}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})
export class DialogContent {

  constructor(
    public dialogRef: MatDialogRef<DialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onCancel(): void {
    this.dialogRef.close();
  }

}
