import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { userType } from '../enum/user.type.enum';

@Entity({ name: 'Users', schema: 'PicPay' })
export class User {

  constructor(nome: string, cpf_cnpj: number, email: string, senha: string, user_type: userType){
    this.nome = nome;
    this.cpf_cnpj = cpf_cnpj;
    this.email= email;
    this.senha = senha;
    this.user_type = user_type;
  }

  @Column({ name: 'NOME' })
  @IsNotEmpty()
  nome: string;

  @PrimaryColumn({ name: 'CPFCNPJ'})
  @IsNotEmpty()
  cpf_cnpj: number;

  @PrimaryColumn({ name: 'EMAIL' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ name: 'SENHA' })
  @IsNotEmpty()
  senha: string;

  @Column({name: 'USERTYPE', enum: userType})
  @IsNotEmpty()
  user_type: userType;
  
}



