import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ExamCreateStudentComponent } from './exam-create-student.component';
import { HttpClientModule } from '@angular/common/http';

describe('ExamCreateStudentComponent', () => {
  let component: ExamCreateStudentComponent;
  let fixture: ComponentFixture<ExamCreateStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ ExamCreateStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamCreateStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
