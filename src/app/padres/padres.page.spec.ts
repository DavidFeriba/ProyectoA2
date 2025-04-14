import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PadresPage } from './padres.page';

describe('PadresPage', () => {
  let component: PadresPage;
  let fixture: ComponentFixture<PadresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PadresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
