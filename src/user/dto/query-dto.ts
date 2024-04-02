import { IsEmail, IsOptional, IsPositive } from 'class-validator';

export class QueryDto {
  @IsOptional()
  cpf_cnpj?: number;

  @IsOptional()
  @IsEmail()
  email?: string;
}
