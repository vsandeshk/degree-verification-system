import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-admin-create-users',
  templateUrl: './admin-create-users.component.html',
  styleUrls: ['./admin-create-users.component.css']
})
export class AdminCreateUsersComponent implements OnInit {

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

    if (role != "Admin") {
      this.router.navigate(['login'])
    }

    this.initForm();

  }

  initForm() {
    this.formGroup = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      user_role: new FormControl('', [Validators.required])
    });
  }

  resetFields() {
    this.spin = false;
    this.formGroup.reset();
  }

  registerUserProcess() {
    if (this.formGroup.valid && (this.formGroup.value.new_password == this.formGroup.value.confirm_password)) {
      this.spin = true;
      this.authService.registerUserProcess(this.formGroup.value).subscribe(results => {
        alert(results);
        this.resetFields();
      }, error => {
        this.resetFields();
        alert(error.error);
      });
    }
  }

}
