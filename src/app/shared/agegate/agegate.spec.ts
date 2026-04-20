import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agegate } from './agegate';

describe('Agegate', () => {
  let component: Agegate;
  let fixture: ComponentFixture<Agegate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agegate],
    }).compileComponents();

    fixture = TestBed.createComponent(Agegate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
