import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ExamViewStudentsComponent } from './exam-view-students.component';
import { HttpClientModule } from '@angular/common/http';

describe('ExamViewStudentsComponent', () => {
  let component: ExamViewStudentsComponent;
  let fixture: ComponentFixture<ExamViewStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ ExamViewStudentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamViewStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
