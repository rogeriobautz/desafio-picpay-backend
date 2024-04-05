import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export class Transactions {

    constructor(valor: number, pagadorCpf: number, recebedorCpf: number){
        this.valor = valor;
        this.pagadorCpf = pagadorCpf;
        this.recebedorCpf = recebedorCpf;
        this.uuid = uuidv4();
    }
    
    @Column({name: 'UUID'})
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
    created_at: Date;

}
