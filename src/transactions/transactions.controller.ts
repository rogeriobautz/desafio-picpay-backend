import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transactions.dto';

@Controller('transaction')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}
 
  @Post('execute')
  execute(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.transfere(createTransactionDto);
  }

  @Get('find/pagador/:cpf')
  async findByPagador(@Param('cpfcnpj', ParseIntPipe) cpfCnpj: number) {
    return await this.transactionService.findByPagadorCpf(cpfCnpj);
  }

  @Get('find/recebedor/:cpf')
  async findByRecebedor(@Param('cpfcnpj', ParseIntPipe) cpfCnpj: number) {
    return await this.transactionService.findByRecebedorCpf(cpfCnpj);
  }
 
  @Get('find/:uuid')
  async findByUUID(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return await this.transactionService.findByUUID(uuid);
  }

  @Get('find/:date')
  async findByDate(@Param('uuid') date: Date) {
    return await this.transactionService.findByDate(date);
  }

  @Get('find')
  async findAll() {
    return await this.transactionService.findAll();
  }

}
