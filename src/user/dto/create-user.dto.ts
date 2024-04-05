import { IsEmail, IsNotEmpty, IsNumber, IsOptional, isNumber } from "class-validator";
import { userType } from "../enum/user.type.enum";

export class CreateUserDto{

  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  cpf_cnpj: number;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  senha: string;

  @IsNotEmpty()
  user_type: userType;

  @IsNumber()
  @IsOptional()
  saldo: number;

}
