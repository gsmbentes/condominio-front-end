import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chamados } from './chamados';

describe('Chamados', () => {
  let component: Chamados;
  let fixture: ComponentFixture<Chamados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chamados],
    }).compileComponents();

    fixture = TestBed.createComponent(Chamados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
