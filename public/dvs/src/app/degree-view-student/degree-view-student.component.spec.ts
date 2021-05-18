import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DegreeViewStudentComponent } from './degree-view-student.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

describe('DegreeViewStudentComponent', () => {
  let component: DegreeViewStudentComponent;
  let fixture: ComponentFixture<DegreeViewStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
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
