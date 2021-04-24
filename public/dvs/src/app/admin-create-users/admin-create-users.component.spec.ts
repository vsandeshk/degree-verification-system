import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateUsersComponent } from './admin-create-users.component';

describe('AdminCreateUsersComponent', () => {
  let component: AdminCreateUsersComponent;
  let fixture: ComponentFixture<AdminCreateUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCreateUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
