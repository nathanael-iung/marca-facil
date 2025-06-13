import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
  // O construtor da classe PrismaService chama o construtor da classe pai (PrismaClient).
  // O PrismaClient aceita opções de configuração, como a fonte de dados (datasourceUrl),
  // mas para este projeto, ele lerá automaticamente a variável DATABASE_URL do seu arquivo .env.
  constructor() {
    super();
  }

  // onModuleInit é um hook de ciclo de vida do NestJS.
  // Este método será chamado assim que o módulo que contém este serviço for inicializado.
  // Usamos ele para garantir que a conexão com o banco de dados seja estabelecida.
  async onModuleInit() {
    await this.$connect();
  }

  async onApplicationShutdown(signal?: string) {
    await this.$disconnect();
  }
}
