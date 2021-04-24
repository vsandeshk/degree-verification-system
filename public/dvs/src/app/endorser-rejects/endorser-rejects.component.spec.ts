import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorserRejectsComponent } from './endorser-rejects.component';

describe('EndorserRejectsComponent', () => {
  let component: EndorserRejectsComponent;
  let fixture: ComponentFixture<EndorserRejectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
