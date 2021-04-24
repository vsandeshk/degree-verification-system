import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-student-search',
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.css']
})
export class StudentSearchComponent implements OnInit {

  formGroup: FormGroup;
  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    localStorage.removeItem("student_id");
    this.initForm();
  }
  initForm() {
    this.formGroup = new FormGroup({
      student_id: new FormControl('', [Validators.required])
    });
  }
  searchProcess() {
    if (this.formGroup.valid) {
      let student_id = this.formGroup.value.student_id;

      localStorage.setItem("student_id", student_id);
      this.router.navigate(['degree'])
    }
  }

}
