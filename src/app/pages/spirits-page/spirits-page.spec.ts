import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpiritsPage } from './spirits-page';

describe('SpiritsPage', () => {
  let component: SpiritsPage;
  let fixture: ComponentFixture<SpiritsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpiritsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SpiritsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
