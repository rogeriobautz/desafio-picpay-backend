import { IsNotEmpty } from "class-validator";
import { UUID, randomUUID } from "crypto";
import { Column, CreateDateColumn } from "typeorm";

export class Transactions {

    constructor(valor: number, pagadorCpf: number, recebedorCpf: number){
        this.valor = valor;
        this.pagadorCpf = pagadorCpf;
        this.recebedorCpf = recebedorCpf;
        this.uuid = randomUUID();
    }
    
    @Column({name: 'UUID'})
    uuid: UUID;

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
