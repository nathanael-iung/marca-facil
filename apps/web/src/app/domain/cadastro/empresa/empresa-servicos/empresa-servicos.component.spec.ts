import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpresaServicosComponent } from './empresa-servicos.component';

describe('EmpresaServicosComponent', () => {
  let component: EmpresaServicosComponent;
  let fixture: ComponentFixture<EmpresaServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaServicosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresaServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
