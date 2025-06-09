import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClienteServicosComponent } from './cliente-servicos.component';

describe('ClienteServicosComponent', () => {
  let component: ClienteServicosComponent;
  let fixture: ComponentFixture<ClienteServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteServicosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
