import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorserPendingComponent } from './endorser-pending.component';

describe('EndorserPendingComponent', () => {
  let component: EndorserPendingComponent;
  let fixture: ComponentFixture<EndorserPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorserPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorserPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
