import { IsEmail, IsNotEmpty } from "class-validator";
import { userType } from "../enum/user.type.enum";
import { Transform } from "class-transformer";

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

}
