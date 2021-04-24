import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamViewStudentsComponent } from './exam-view-students.component';

describe('ExamViewStudentsComponent', () => {
  let component: ExamViewStudentsComponent;
  let fixture: ComponentFixture<ExamViewStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
