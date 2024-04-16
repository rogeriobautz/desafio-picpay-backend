import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'Transactions', schema: 'PicPay' })
export class Transactions {

    constructor(valor: number, pagadorCpf: number, recebedorCpf: number){
        this.valor = valor;
        this.pagadorCpf = pagadorCpf;
        this.recebedorCpf = recebedorCpf;
        this.uuid = uuidv4();
    }
    
    @PrimaryColumn({name: 'UUID'})
    uuid: string;

    @Column({name: 'VALOR'})
    @IsNotEmpty()
    valor: number;
    
    @Column({name: 'PAGADOR'})
    @IsNotEmpty()
    pagadorCpf: number;
    
    @Column({name: 'RECEBEDOR'})
    @IsNotEmpty()
    recebedorCpf: number;    

    @CreateDateColumn()
    createdAt: Date;

}
