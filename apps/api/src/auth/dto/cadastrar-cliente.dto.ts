import { IsEmail, IsString, Length, IsNotEmpty, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CadastrarClienteDto {

  @IsString()
  @IsNotEmpty({ message: 'O CPF não pode ser vazio.' })
  @Length(11, 11, {message: 'O CPF deve possuir 11 caracteres'})
  cpf: string;

  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  @IsString()
  nome: string;

  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  @IsEmail({}, {message: 'O email está em um formato inválido'})
  email: string;

  @IsNotEmpty({ message: 'O telefone não pode ser vazio.' })
  @IsString()
  telefone: string;

  @IsNotEmpty({ message: 'A data de nascimento não pode ser vazia.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'A data de nascimento deve estar no formato YYYY-MM-DD.'})
  data_nascimento: string;

  @IsNotEmpty({ message: 'O CEP não pode ser vazio.' })
  @IsString()
  @Length(9, 9, { message: 'O CEP deve ter 9 caracteres.' })
  cep: string;

  @IsString()
  @Length(2, 2, {message: 'O UF deve possuir 2 caracteres'})
  uf: string;

  @IsString()
  cidade: string;

  @IsString()
  bairro: string;

  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  @IsString()
  @Length(6, 20, {message: 'A senha deve deve possuir de 6 a 20 caracteres'})
  password: string;

}
