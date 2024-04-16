import { IsEmail, IsNotEmpty, IsNumber, IsOptional, isNumber } from "class-validator";
import { userType } from "../enum/user.type.enum";

export class CreateUserDto{

  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  cpfCnpj: number;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  senha: string;

  @IsNotEmpty()
  userType: userType;

  @IsNumber()
  @IsOptional()
  valorSaldo: number;

}
