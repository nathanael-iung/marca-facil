export interface iFormCadastroCliente {
  cpf: string,
  nome: string,
  dat_nasc: string,
  cep: string,
  uf: string,
  cidade: string,
  bairro: string,
  email: string,
  telefone: string,
  password: string,
  password_repeat?: string
}

export interface iUser {
  id: number,
  email: string,
  telefone: string,
  createdAt: string,
  updatedAt: string,
}

export interface iClient {
  userId: number,
  cpf: string,
  nome: string,
  data_nascimento: string,
  cep: string,
  uf: string,
  cidade: string,
  bairro: string,
}

export interface iCompany {
  userId: number,
  cnpj: string,
  razao_social: string,
  cep: string,
  uf: string,
  cidade: string,
  bairro: string,
  endereco: string,
  numero: string,
  complemento?: string,
}
