import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: 'Saldo', schema: 'PicPay' })
export class Saldo {
    constructor(cpfCnpj: number, valor: number) {
        this.cpfCnpj = cpfCnpj;
        this.valor = valor;
        this.ultimaMudanca = new Date();
        this.uuid = uuidv4();
    }

    @Column({ name: "VALOR" })
    valor: number;

    @Column({ name: "UUID" })
    uuid: string; 

    @PrimaryColumn({ name: "cpfCnpj" })
    cpfCnpj: number;

    @Column({ name: "ULT_MUD" })
    ultimaMudanca: Date;
}

