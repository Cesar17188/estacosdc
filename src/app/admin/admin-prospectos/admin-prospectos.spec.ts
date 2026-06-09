import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProspectos } from './admin-prospectos';

describe('AdminProspectos', () => {
  let component: AdminProspectos;
  let fixture: ComponentFixture<AdminProspectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProspectos],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProspectos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
