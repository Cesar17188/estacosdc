import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasPage } from './visitas-page';

describe('VisitasPage', () => {
  let component: VisitasPage;
  let fixture: ComponentFixture<VisitasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitasPage],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
