import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlumnosLoginPage } from './alumnos-login.page';

describe('AlumnosLoginPage', () => {
  let component: AlumnosLoginPage;
  let fixture: ComponentFixture<AlumnosLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnosLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
