import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-endorser',
  templateUrl: './endorser.component.html',
  styleUrls: ['./endorser.component.css']
})
export class EndorserComponent implements OnInit {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    let role = localStorage.getItem("role");

    if (role != "PC" && role != "VC") {
      this.router.navigate(['login'])
    }

    this.authService.getCurrentUser().subscribe(results => {
      console.log(results);
      if (!results.active) {
        alert("User deactivated. Please contact admin!");
        this.router.navigate(['login'])
      }
    }, error => {
      alert(error.error);
    });
  }


}
