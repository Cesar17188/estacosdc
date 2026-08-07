import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { WhiskyRealAudienciaPage } from './whisky-real-audiencia-page';
import { provideRouter } from '@angular/router';

describe('WhiskyRealAudienciaPage', () => {
  let component: WhiskyRealAudienciaPage;
  let fixture: ComponentFixture<WhiskyRealAudienciaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhiskyRealAudienciaPage],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(WhiskyRealAudienciaPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create WhiskyRealAudienciaPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default Whisky Real Audiencia product', () => {
    expect(component.defaultWhiskyRealAudiencia.name).toContain('Whisky Real Audiencia');
  });
});
