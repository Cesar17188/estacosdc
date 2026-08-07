import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { WhiskeyChillosValleyPage } from './whiskey-chillos-valley-page';
import { provideRouter } from '@angular/router';

describe('WhiskeyChillosValleyPage', () => {
  let component: WhiskeyChillosValleyPage;
  let fixture: ComponentFixture<WhiskeyChillosValleyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhiskeyChillosValleyPage],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(WhiskeyChillosValleyPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create WhiskeyChillosValleyPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default Whiskey Chillos Valley product', () => {
    expect(component.defaultWhiskeyChillosValley.name).toContain('Whiskey Chillos Valley Grain');
  });
});
