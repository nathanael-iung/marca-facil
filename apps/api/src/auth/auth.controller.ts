import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CadastrarClienteDto } from "./dto/cadastrar-cliente.dto";
import { CadastrarEmpresaDto } from "./dto/cadastrar-empresa.dto";

@Controller('auth') // Todas as rotas aqui começarão com /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/client') // Rota: POST /auth/register/client
  registerClient(@Body() createClientDto: CadastrarClienteDto) {
    return this.authService.createClient(createClientDto);
  }

  @Post('register/company') // Rota: POST /auth/register/company
  registerCompany(@Body() createCompanyDto: CadastrarEmpresaDto) {
    return this.authService.createCompany(createCompanyDto);
  }
}
