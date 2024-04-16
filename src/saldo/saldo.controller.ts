import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SaldoService } from './saldo.service';

@Controller('saldo')
export class SaldoController {

    constructor (private saldoService: SaldoService){}
    
    @Get('find/all')
    async findAll(){
        return await this.saldoService.findAll();
    }
    
    @Get('find/:cpfCnpj')
    async findByCpfCnpj(@Param('cpfCnpj', ParseIntPipe) cpfCnpj: number){
        return await this.saldoService.findByCpfCnpj(cpfCnpj);
    }

}
