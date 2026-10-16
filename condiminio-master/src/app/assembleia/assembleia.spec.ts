import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Assembleia } from './assembleia';

describe('Assembleia', () => {
  let component: Assembleia;
  let fixture: ComponentFixture<Assembleia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Assembleia]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Assembleia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
