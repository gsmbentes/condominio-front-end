import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Moradores } from './moradores';

describe('Moradores', () => {
  let component: Moradores;
  let fixture: ComponentFixture<Moradores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moradores],
    }).compileComponents();

    fixture = TestBed.createComponent(Moradores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
