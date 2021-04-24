import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component'
import { AuthGuard } from './auth.guard';
import { EndorserComponent } from './endorser/endorser.component';
import { ExaminationComponent } from './examination/examination.component';
import { TokenInterceptorService } from './token-interceptor.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AdminViewUsersComponent } from './admin-view-users/admin-view-users.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminCreateUsersComponent } from './admin-create-users/admin-create-users.component';
import { MatSelectModule } from '@angular/material/select';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ExamViewStudentsComponent } from './exam-view-students/exam-view-students.component';
import { ExamCreateStudentComponent } from './exam-create-student/exam-create-student.component';
import { EndorserPendingComponent } from './endorser-pending/endorser-pending.component';
import { EndorserEndorsementsComponent } from './endorser-endorsements/endorser-endorsements.component';
import { EndorserRejectsComponent } from './endorser-rejects/endorser-rejects.component';
import { StudentSearchComponent } from './student-search/student-search.component';
import { ViewStudentComponent,DialogContent } from './view-student/view-student.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DegreeComponent } from './degree/degree.component';
import { DegreeViewStudentComponent } from './degree-view-student/degree-view-student.component';
import { DigitalComponent } from './digital/digital.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    EndorserComponent,
    ExaminationComponent,
    AdminViewUsersComponent,
    AdminCreateUsersComponent,
    ChangePasswordComponent,
    ExamViewStudentsComponent,
    ExamCreateStudentComponent,
    EndorserPendingComponent,
    EndorserEndorsementsComponent,
    EndorserRejectsComponent,
    StudentSearchComponent,
    ViewStudentComponent,
    DialogContent,
    DegreeComponent,
    DegreeViewStudentComponent,
    DigitalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
