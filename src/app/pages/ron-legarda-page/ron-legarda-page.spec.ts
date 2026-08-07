import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { RonLegardaPage } from './ron-legarda-page';
import { provideRouter } from '@angular/router';

describe('RonLegardaPage', () => {
  let component: RonLegardaPage;
  let fixture: ComponentFixture<RonLegardaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RonLegardaPage],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RonLegardaPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create RonLegardaPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default Ron Legarda product', () => {
    expect(component.defaultRonLegarda.name).toContain('Ron Estancos Legarda');
  });
});
