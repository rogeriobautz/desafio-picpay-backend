import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { userType } from '../enum/user.type.enum';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'Users', schema: 'PicPay' })
export class User {

  constructor(nome: string, cpf_cnpj: number, email: string, senha: string, user_type: userType){
    this.nome = nome;
    this.cpf_cnpj = cpf_cnpj;
    this.email= email;
    this.senha = senha;
    this.user_type = user_type;
    this.uuid = uuidv4();
  }

  @Column({name: "UUID"})
    uuid: string;

  @Column({ name: 'NOME' })
  @IsNotEmpty()
  nome: string;

  @PrimaryColumn({ name: 'CPF_CNPJ'})
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



