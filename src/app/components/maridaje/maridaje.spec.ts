import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maridaje } from './maridaje';

describe('Maridaje', () => {
  let component: Maridaje;
  let fixture: ComponentFixture<Maridaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maridaje],
    }).compileComponents();

    fixture = TestBed.createComponent(Maridaje);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
