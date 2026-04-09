import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaPage } from './tienda-page';

describe('TiendaPage', () => {
  let component: TiendaPage;
  let fixture: ComponentFixture<TiendaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendaPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TiendaPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
