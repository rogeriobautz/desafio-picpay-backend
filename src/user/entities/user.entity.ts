import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { userType } from '../enum/user.type.enum';
import { v4 as uuidv4 } from 'uuid';
import { Saldo } from 'src/saldo/entities/saldo.entity';

@Entity({ name: 'Users', schema: 'PicPay' })
export class User {

  constructor(nome: string, cpfCnpj: number, email: string, senha: string, userType: userType) {
    this.nome = nome; 
    this.cpfCnpj = cpfCnpj;
    this.email = email;
    this.senha = senha;
    this.userType = userType;
    this.uuid = uuidv4();
  }

  @Column({ name: "UUID" })
  uuid: string;

  @Column({ name: 'NOME' })
  @IsNotEmpty()
  nome: string;

  @PrimaryColumn({ name: 'cpfCnpj' })
  @IsNotEmpty()
  cpfCnpj: number;

  @PrimaryColumn({ name: 'EMAIL' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ name: 'SENHA' })
  @IsNotEmpty()
  senha: string;

  @Column({ name: 'USERTYPE', enum: userType })
  @IsNotEmpty()
  userType: userType;
  
}



