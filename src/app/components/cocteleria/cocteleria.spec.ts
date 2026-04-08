import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cocteleria } from './cocteleria';

describe('Cocteleria', () => {
  let component: Cocteleria;
  let fixture: ComponentFixture<Cocteleria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cocteleria],
    }).compileComponents();

    fixture = TestBed.createComponent(Cocteleria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
