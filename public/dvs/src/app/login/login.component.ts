import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    localStorage.clear();
    this.initForm();
  }
  initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  loginProcess() {
    if (this.formGroup.valid) {
      this.authService.login(this.formGroup.value).subscribe(results => {
        if (results.role) {
          localStorage.setItem('token', results.token);
          localStorage.setItem('role', results.role);
          if (results.role == "Admin")
            this.router.navigate(['/admin'])
          else if (results.role == "EX")
            this.router.navigate(['examination'])
          else if (results.role == "PC" || results.role == "VC")
            this.router.navigate(['endorser'])
        } else {
          console.log("faile");
        }
      }, error => {
        alert(error.error);
      })
    }
  }

}
