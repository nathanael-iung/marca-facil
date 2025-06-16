import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';

export class CadastrarEmpresaDto {

  @IsString()
  @IsNotEmpty({ message: 'O CNPJ não pode ser vazio.' })
  @Length(14, 14, { message: 'O CNPJ deve possuir 14 caracteres.' })
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  razao_social: string;

  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  @IsEmail({}, {message: 'O email está em um formato inválido'})
  email: string;

  @IsNotEmpty({ message: 'O telefone não pode ser vazio.' })
  @IsString()
  telefone: string;

  @IsString()
  @IsNotEmpty({ message: 'O CEP não pode ser vazio.' })
  @Length(8, 8, { message: 'O CEP deve ter 8 caracteres.' })
  cep: string;

  @IsString()
  @IsNotEmpty({ message: 'A UF não pode ser vazia.' })
  @Length(2, 2, { message: 'A UF deve ter 2 caracteres.' })
  uf: string;

  @IsString()
  @IsNotEmpty({ message: 'A cidade não pode ser vazia.' })
  cidade: string;

  @IsString()
  @IsNotEmpty({ message: 'O bairro não pode ser vazio.' })
  bairro: string;

  @IsString()
  @IsNotEmpty({ message: 'O endereço não pode ser vazio.' })
  endereco: string;

  @IsString()
  @IsNotEmpty({ message: 'O número não pode ser vazio.' })
  numero: string;

  @IsString()
  complemento?: string;

  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  @IsString()
  @Length(6, 20, {message: 'A senha deve deve possuir de 6 a 20 caracteres'})
  password: string;

}
