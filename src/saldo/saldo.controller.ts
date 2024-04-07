import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SaldoService } from './saldo.service';

@Controller('saldo')
export class SaldoController {

    constructor (private saldoService: SaldoService){}

    @Get('find')
    async findByCpfCnpj(@Query('cpf_cnpj', ParseIntPipe) cpf_cnpj: number){
        return await this.saldoService.findByCpfCnpj(cpf_cnpj);
    }

    @Get('find/all')
    async findAll(){
        return await this.saldoService.findAll();
    }
}
