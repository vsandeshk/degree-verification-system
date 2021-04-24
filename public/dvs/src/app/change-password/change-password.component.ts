import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  formGroup: FormGroup;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  spin: boolean;
  password_matched: boolean;
  role: string;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.spin = false;
    this.password_matched = true;

  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      old_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required])
    });
  }

  resetFields() {
    this.spin = false;
    this.formGroup.reset();
  }

  matchPassword() {

    if (this.formGroup.value.new_password == this.formGroup.value.confirm_password) {
      this.password_matched = true;
    } else {
      this.password_matched = false;
    }
  }

  changePasswordProcess() {
    if (this.formGroup.valid && (this.formGroup.value.new_password == this.formGroup.value.confirm_password)) {
      this.spin = true;
      this.authService.changePassword(this.formGroup.value).subscribe(results => {
        alert(results);
        this.resetFields();
      }, error => {
        this.resetFields();
        alert(error.error);
      });
    }
  }




}
