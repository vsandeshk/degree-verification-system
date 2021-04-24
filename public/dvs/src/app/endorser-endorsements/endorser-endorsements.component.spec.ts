import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorserEndorsementsComponent } from './endorser-endorsements.component';

describe('EndorserEndorsementsComponent', () => {
  let component: EndorserEndorsementsComponent;
  let fixture: ComponentFixture<EndorserEndorsementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorserEndorsementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorserEndorsementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
