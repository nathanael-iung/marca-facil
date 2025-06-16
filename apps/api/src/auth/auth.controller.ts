import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CadastrarClienteDto } from "./dto/cadastrar-cliente.dto";
import { CadastrarEmpresaDto } from "./dto/cadastrar-empresa.dto";
import { LoginDto } from "./dto/login.dto";
import { Response } from 'express';

@Controller('auth') // Todas as rotas aqui começarão com /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Status 200 para login bem-sucedido
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, user } = await this.authService.login(loginDto);

    response.cookie('access_token', accessToken, {
      httpOnly: true, // Impede acesso via JavaScript
      secure: process.env.NODE_ENV === 'production', // Enviar apenas sobre HTTPS em produção
      sameSite: 'strict', // Proteção extra contra ataques CSRF
      path: '/', // O cookie estará disponível em todo o site
    });

    // Retorna os dados do usuário no corpo da resposta
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logout bem-sucedido.' };
  }

  @Post('register/client') // Rota: POST /auth/register/client
  registerClient(@Body() createClientDto: CadastrarClienteDto) {
    return this.authService.createClient(createClientDto);
  }

  @Post('register/company') // Rota: POST /auth/register/company
  registerCompany(@Body() createCompanyDto: CadastrarEmpresaDto) {
    return this.authService.createCompany(createCompanyDto);
  }
}
