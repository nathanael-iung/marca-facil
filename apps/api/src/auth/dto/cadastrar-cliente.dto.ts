import { IsEmail, IsString, IsDateString, Length, IsNotEmpty } from 'class-validator';

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
  @IsDateString({}, {message: 'A data de nascimento está em um formato inválido'})
  data_nascimento: string;

  @IsNotEmpty({ message: 'O CEP não pode ser vazio.' })
  @IsString()
  cep: string;

  @IsString()
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
