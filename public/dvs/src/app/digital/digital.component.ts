import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-digital',
  templateUrl: './digital.component.html',
  styleUrls: ['./digital.component.css']
})
export class DigitalComponent implements OnInit {


  mobileQuery: MediaQueryList;
  student_data: any;

  private _mobileQueryListener: () => void;

  student_id: string;
  pcSign: boolean;
  vcSign: boolean;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.student_id = localStorage.getItem("student_id");
    if (this.student_id == undefined) {
      this.router.navigate([''])
    }
    this.getStudent(this.student_id);
    this.pcSign = false;
    this.vcSign = false;
  }

  setEndorserIDHash() {

    this.student_data.vice_chancellor.endorser_hashID = '';
    this.student_data.pro_chancellor.endorser_hashID = '';

    let pc = this.student_data.pro_chancellor.endorser_id;

    if (pc != undefined && pc != '') {
      this.student_data.pro_chancellor.endorser_hashID = btoa(pc);
      if (this.student_data.pro_chancellor.type != "Rejected") {
        this.pcSign = true;
      }
    }
    let vc = this.student_data.vice_chancellor.endorser_id;
    if (vc != undefined && vc != '') {
      this.student_data.vice_chancellor.endorser_hashID = btoa(vc);

      if (this.student_data.vice_chancellor.type != "Rejected") {
        this.vcSign = true;
      }
    }
    console.log(this.student_data);

  }

  getStudent(student_id) {
    this.authService.getStudentDegree(student_id).subscribe(results => {
      this.student_data = results;
      this.setEndorserIDHash();
      console.log(this.student_data);
    }, error => {
      alert(error.error);
    });
  }


}
