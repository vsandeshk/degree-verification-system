import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorserComponent } from './endorser.component';

describe('EndorserComponent', () => {
  let component: EndorserComponent;
  let fixture: ComponentFixture<EndorserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
