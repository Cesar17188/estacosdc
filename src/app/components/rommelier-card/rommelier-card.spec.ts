import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RommelierCard } from './rommelier-card';

describe('RommelierCard', () => {
  let component: RommelierCard;
  let fixture: ComponentFixture<RommelierCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RommelierCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RommelierCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
