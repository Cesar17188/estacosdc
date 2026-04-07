import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RommeliersPage } from './rommeliers-page';

describe('RommeliersPage', () => {
  let component: RommeliersPage;
  let fixture: ComponentFixture<RommeliersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RommeliersPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RommeliersPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
