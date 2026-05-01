import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCocteleria } from './admin-cocteleria';

describe('AdminCocteleria', () => {
  let component: AdminCocteleria;
  let fixture: ComponentFixture<AdminCocteleria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCocteleria],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCocteleria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
