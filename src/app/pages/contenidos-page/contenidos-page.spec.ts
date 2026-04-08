import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidosPage } from './contenidos-page';

describe('ContenidosPage', () => {
  let component: ContenidosPage;
  let fixture: ComponentFixture<ContenidosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidosPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenidosPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
