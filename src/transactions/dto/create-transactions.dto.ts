import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class CreateTransactionDto {

    constructor(valor: number, pagadorCpf: number, recebedorCpf: number){
        this.valor = valor;
        this.pagadorCpf = pagadorCpf;
        this.recebedorCpf = recebedorCpf;
    }


    @Column({name: 'VALOR'})
    @IsNotEmpty()
    valor: number; 
    
    @Column({name: 'PAGADOR'})
    @IsNotEmpty()
    pagadorCpf: number;
    
    @Column({name: 'RECEBEDOR'})
    @IsNotEmpty()
    recebedorCpf: number;
}
