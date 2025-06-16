import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'O identificador (email, CPF ou CNPJ) não pode ser vazio.'})
  identifier: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.'})
  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  password: string;
}
