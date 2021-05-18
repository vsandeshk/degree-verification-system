import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ExaminationComponent } from './examination.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

describe('ExaminationComponent', () => {
  let component: ExaminationComponent;
  let fixture: ComponentFixture<ExaminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule, HttpClientModule],
      declarations: [ ExaminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
