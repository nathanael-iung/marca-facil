// src/auth/auth.service.ts
import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assumindo que você tem um PrismaService
import * as bcrypt from 'bcrypt';
import { CadastrarClienteDto } from "./dto/cadastrar-cliente.dto";
import { CadastrarEmpresaDto } from "./dto/cadastrar-empresa.dto";

@Injectable()
export class AuthService {

  constructor(private readonly prisma: PrismaService) {}

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
