import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnadirHijoPage } from './anadir-hijo.page';

describe('AnadirHijoPage', () => {
  let component: AnadirHijoPage;
  let fixture: ComponentFixture<AnadirHijoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnadirHijoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
