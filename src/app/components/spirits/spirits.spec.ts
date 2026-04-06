import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spirits } from './spirits';

describe('Spirits', () => {
  let component: Spirits;
  let fixture: ComponentFixture<Spirits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spirits],
    }).compileComponents();

    fixture = TestBed.createComponent(Spirits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
