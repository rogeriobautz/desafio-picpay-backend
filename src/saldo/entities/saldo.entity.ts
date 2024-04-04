import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Saldo {
    constructor(cpf_cnpj: number, valor: number){
        this.cpf_cnpj = cpf_cnpj;
        this.valor = valor;
        this.ultima_mudanca = new Date();
    }     

    @Column({name: "VALOR"})
    valor: number;

    @OneToOne((type) => User, user => user.cpf_cnpj)
    @JoinColumn({name: "CPF_CNPJ"})
    cpf_cnpj: number;

    @Column({name: "ULT_MUD"})
    ultima_mudanca: Date;
}
