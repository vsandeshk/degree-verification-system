import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.css']
})
export class DegreeComponent implements OnInit {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  student_id:string;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
   this.student_id = localStorage.getItem("student_id");
   console.log(this.student_id);

    if (this.student_id == undefined) {
      this.router.navigate([''])
    }

  }

}
