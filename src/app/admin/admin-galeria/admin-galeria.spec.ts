import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGaleria } from './admin-galeria';

describe('AdminGaleria', () => {
  let component: AdminGaleria;
  let fixture: ComponentFixture<AdminGaleria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGaleria],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminGaleria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
