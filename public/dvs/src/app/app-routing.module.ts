import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminViewUsersComponent } from './admin-view-users/admin-view-users.component';
import { AdminCreateUsersComponent } from './admin-create-users/admin-create-users.component';
import { ExaminationComponent } from './examination/examination.component';
import { EndorserComponent } from './endorser/endorser.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ExamViewStudentsComponent } from './exam-view-students/exam-view-students.component';
import { ExamCreateStudentComponent } from './exam-create-student/exam-create-student.component';
import { EndorserPendingComponent } from './endorser-pending/endorser-pending.component';
import { EndorserEndorsementsComponent } from './endorser-endorsements/endorser-endorsements.component';
import { EndorserRejectsComponent } from './endorser-rejects/endorser-rejects.component';
import { StudentSearchComponent } from './student-search/student-search.component';
import { ViewStudentComponent } from './view-student/view-student.component';
import { DegreeComponent } from './degree/degree.component';
import { DegreeViewStudentComponent } from './degree-view-student/degree-view-student.component';
import { DigitalComponent } from './digital/digital.component';

import { AuthGuard } from './auth.guard';
const routes: Routes = [
  {
    path: '', component: StudentSearchComponent
  },
  {
    path: 'degree', component: DegreeComponent
  },
  {
    path: 'degree/view-student', component: DegreeViewStudentComponent
  },
  {
    path: 'degree/digital', component: DigitalComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard]
  },
  {
    path: 'admin/view-users', component: AdminViewUsersComponent, canActivate: [AuthGuard]
  },
  {
    path: 'admin/new-user', component: AdminCreateUsersComponent, canActivate: [AuthGuard]
  },
  {
    path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]
  },
  {
    path: 'endorser', component: EndorserComponent, canActivate: [AuthGuard]
  },
  {
    path: 'endorser/pending-endorsements', component: EndorserPendingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'endorser/my-endorsements', component: EndorserEndorsementsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'endorser/my-rejects', component: EndorserRejectsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'exam/view-students', component: ExamViewStudentsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'view-student', component: ViewStudentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'exam/new-student', component: ExamCreateStudentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'examination', component: ExaminationComponent, canActivate: [AuthGuard]
  },
  { path: '**', component: StudentSearchComponent, redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
