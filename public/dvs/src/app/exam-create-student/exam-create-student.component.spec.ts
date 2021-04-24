import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamCreateStudentComponent } from './exam-create-student.component';

describe('ExamCreateStudentComponent', () => {
  let component: ExamCreateStudentComponent;
  let fixture: ComponentFixture<ExamCreateStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
