// src/auth/auth.service.ts
import { ConflictException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assumindo que você tem um PrismaService
import * as bcrypt from 'bcrypt';
import { CadastrarClienteDto } from "./dto/cadastrar-cliente.dto";
import { CadastrarEmpresaDto } from "./dto/cadastrar-empresa.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {

  constructor(private readonly prisma: PrismaService,
              private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string, user: any }> {

    const { identifier, password } = loginDto;

    let user: User | null = null;

    // Removemos a formatação para verificar CPF/CNPJ
    const sanitizedIdentifier = identifier.replace(/[^\d]/g, '');

    // 1. Detectar o tipo de identificador e buscar o usuário
    if (identifier.includes('@')) {
      // É um email, busca direto na tabela User
      user = await this.prisma.user.findUnique({ where: { email: identifier } });
    } else if (sanitizedIdentifier.length === 11) {
      // É um CPF, busca na tabela Client e inclui o User relacionado
      const client = await this.prisma.client.findUnique({
        where: { cpf: sanitizedIdentifier },
        include: { user: true }, // Prisma busca o usuário associado
      });
      user = client?.user ?? null;
    } else if (sanitizedIdentifier.length === 14) {
      // É um CNPJ, busca na tabela Company e inclui o User relacionado
      const company = await this.prisma.company.findUnique({
        where: { cnpj: sanitizedIdentifier },
        include: { user: true },
      });
      user = company?.user ?? null;
    }

    // 2. Validar usuário e senha (lógica existente)
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // 3. Gerar o JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    const { password: _, ...userResult } = user;
    return { accessToken, user: userResult };
  }

  async createClient(dto: CadastrarClienteDto) {

    // 1. Verifica se o e-mail ou CPF já existem
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const existingClient = await this.prisma.client.findUnique({ where: { cpf: dto.cpf } });
    if (existingClient) {
      throw new ConflictException('Este CPF já está cadastrado.');
    }

    // 2. Criptografa a senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 3. Usa uma transação para criar User e Client
    try {
      return await this.prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email: dto.email,
            password: hashedPassword,
            telefone: dto.telefone,
            role: 'CLIENT'
          },
        });

        const newClient = await tx.client.create({
          data: {
            userId: newUser.id,
            cpf: dto.cpf,
            nome: dto.nome,
            data_nascimento: new Date(dto.data_nascimento),
            cep: dto.cep,
            uf: dto.uf,
            cidade: dto.cidade,
            bairro: dto.bairro,
          },
        });

        const result = newUser;
        delete result.password;

        return {
          user: result,
          client: newClient
        }

      });
    } catch (error) {
        // Trata erros da transação
        Logger.log(error)
        throw new InternalServerErrorException('Não foi possível concluir o cadastro. Tente novamente.');
    }
  }

  async createCompany(dto: CadastrarEmpresaDto) {
    // 1. Verifica se o e-mail ou CNPJ já existem
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const existingCompany = await this.prisma.company.findUnique({ where: { cnpj: dto.cnpj } });
    if (existingCompany) {
      throw new ConflictException('Este CNPJ já está cadastrado.');
    }

    // 2. Criptografa a senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 3. Usa uma transação para criar User e Company
    try {
      return await this.prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email: dto.email,
            password: hashedPassword,
            telefone: dto.telefone,
            role: 'COMPANY'
          },
        });

        const newCompany = await tx.company.create({
          data: {
            userId: newUser.id,
            cnpj: dto.cnpj,
            razao_social: dto.razao_social,
            cep: dto.cep,
            uf: dto.uf,
            cidade: dto.cidade,
            bairro: dto.bairro,
            endereco: dto.endereco,
            numero: dto.numero,
            complemento: dto.complemento,
          },
        });

        // Remove a senha do objeto de retorno
        const result = newUser;
        delete result.password;

        return {
          user: result,
          company: newCompany
        }

      });
    } catch (error) {
      Logger.log(error)
      throw new InternalServerErrorException('Não foi possível concluir o cadastro. Tente novamente.');
    }
  }
}
