import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesoradoPage } from './profesorado.page';

describe('ProfesoradoPage', () => {
  let component: ProfesoradoPage;
  let fixture: ComponentFixture<ProfesoradoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesoradoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
