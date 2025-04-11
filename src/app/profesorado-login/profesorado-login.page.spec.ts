import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesoradoLoginPage } from './profesorado-login.page';

describe('ProfesoradoLoginPage', () => {
  let component: ProfesoradoLoginPage;
  let fixture: ComponentFixture<ProfesoradoLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesoradoLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
