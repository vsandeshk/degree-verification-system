import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-exam-create-student',
  templateUrl: './exam-create-student.component.html',
  styleUrls: ['./exam-create-student.component.css']
})
export class ExamCreateStudentComponent implements OnInit {

  formGroup: FormGroup;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  spin: boolean;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.spin = false;

  }

  ngOnInit(): void {
    let role = localStorage.getItem("role");

    if (role != "EX") {
      this.router.navigate(['login'])
    }

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      student_id: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      degree_title: new FormControl('', [Validators.required]),
      degree_programme: new FormControl('', [Validators.required]),
      degree_class: new FormControl('', [Validators.required]),
      completion_year: new FormControl('', [Validators.required])
    });
  }

  resetFields() {
    this.spin = false;
    this.formGroup.reset();
  }


  registerStudentProcess() {
    if (this.formGroup.valid) {
      this.spin = true;
      this.authService.registerStudentProcess(this.formGroup.value).subscribe(results => {
        alert(results);
        this.resetFields();
      }, error => {
        this.resetFields();
        alert(error.error);
      });
    }
  }

}
