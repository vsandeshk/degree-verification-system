import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
  userID: string;
  fName: string;
  lName: string;
  role: string;
  lDate: string;
  active: boolean;
}

@Component({
  selector: 'app-admin-view-users',
  templateUrl: './admin-view-users.component.html',
  styleUrls: ['./admin-view-users.component.css']
})
export class AdminViewUsersComponent implements OnInit {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  displayedColumns: string[] = ['user_id', 'first_name', 'last_name', 'role', 'date', 'active'];
  dataSource: MatTableDataSource<UserData>;

  spin: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.spin = false;
  }

  setTableData(results): void {
    this.dataSource = null;
    this.dataSource = new MatTableDataSource(results);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleUserActivation(user_id): void {
    this.spin = true;
    let params = { username: user_id };
    this.authService.toggleUserActivation(params).subscribe(results => {
      console.log(results);
      this.getUsers();
      this.spin = false;
    }, error => {
      this.spin = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    let role = localStorage.getItem("role");

    if (role != "Admin") {
      this.router.navigate(['login'])
    }
    this.getUsers();
  }

  getUsers(): void {

    this.authService.getAllUsers().subscribe(results => {
      this.setTableData(results);
      //  console.log(results);
    }, error => {
      alert(error.error);
    });
  }

}
