import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EndorserRejectsComponent } from './endorser-rejects.component';
import { HttpClientModule } from '@angular/common/http';

describe('EndorserRejectsComponent', () => {
  let component: EndorserRejectsComponent;
  let fixture: ComponentFixture<EndorserRejectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule, HttpClientModule],
      declarations: [ EndorserRejectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorserRejectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
