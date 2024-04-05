import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4} from "uuid";

@Entity({ name: 'Saldo', schema: 'PicPay' })
export class Saldo {
    constructor(cpf_cnpj: number, valor: number){
        this.cpf_cnpj = cpf_cnpj;
        this.valor = valor;
        this.ultima_mudanca = new Date();
        this.uuid = uuidv4();
    }
    
    @Column({name: "UUID"})
    uuid: string;

    @Column({name: "VALOR"})
    valor: number;

    //@OneToOne((type) => User, user => user.cpf_cnpj)
    @PrimaryColumn({name: "CPF_CNPJ"})
    cpf_cnpj: number;

    @Column({name: "ULT_MUD"})
    ultima_mudanca: Date;
}

