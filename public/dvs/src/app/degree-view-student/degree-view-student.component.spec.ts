import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeViewStudentComponent } from './degree-view-student.component';

describe('DegreeViewStudentComponent', () => {
  let component: DegreeViewStudentComponent;
  let fixture: ComponentFixture<DegreeViewStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DegreeViewStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DegreeViewStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
