import { baseUrl } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  login(data): Observable<any> {
    return this.http.post(`${baseUrl}user/login`, data);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${baseUrl}user/get`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${baseUrl}admin/user/get/all`);
  }

  registerUserProcess(data) {
    return this.http.post(`${baseUrl}admin/user/create`, data);
  }

  toggleUserActivation(data): Observable<any> {
    console.log(data);

    return this.http.post(`${baseUrl}admin/user/active/toggle`, data);
  }

  registerStudentProcess(data) {
    return this.http.post(`${baseUrl}examination/degree/create`, data);
  }

  getStudentDegree(data) {
    return this.http.get(`${baseUrl}degree/get/${data}`);
  }

  getStudent(data) {
    return this.http.get(`${baseUrl}examination/degree/get/${data}`);
  }

  editStudent(data) {
    console.log(data);
    return this.http.post(`${baseUrl}examination/degree/edit/${data.student_id}`, data);
  }

  deleteStudent(data) {
    return this.http.post(`${baseUrl}examination/degree/delete/${data}`, null);
  }

  getAllStudents(): Observable<any> {
    return this.http.get(`${baseUrl}examination/degree/get/all`);
  }

  getAllPendings(): Observable<any> {
    return this.http.get(`${baseUrl}endorser/degree/get/unapproved`);
  }

  getAllEndorsements(): Observable<any> {
    return this.http.get(`${baseUrl}endorser/degree/get/approved`);
  }

  getAllRejects(): Observable<any> {
    return this.http.get(`${baseUrl}endorser/degree/get/rejects`);
  }

  endorseStudentDegree(data): Observable<any> {
    return this.http.post(`${baseUrl}endorser/degree/${data.student_id}/endorse`, data);

  }

  loggedIn() {
    return !!localStorage.getItem("token");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  changePassword(data) {
    return this.http.post(`${baseUrl}user/password/change`, data);
  }

  isEx(): boolean {
    let role = localStorage.getItem("role");
    if (role == 'EX') {
      return true;
    }
    return false;
  }

  isEDR(): boolean {
    let role = localStorage.getItem("role");
    console.log(role);

    if (role == 'PC' || role == 'VC') {
      return true;
    }
    return false;
  }

}
