import { Transactions } from './entities/transactions.entity';
import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { UserService } from 'src/user/user.service';
import { userType } from 'src/user/enum/user.type.enum';
import { SaldoService } from 'src/saldo/saldo.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class TransactionsService {

  constructor(
    @Inject(UserService) private userService: UserService, 
    @Inject(SaldoService) private saldoService: SaldoService,
    @InjectRepository(Transactions) private transactionsRepository: Repository<Transactions>
  ){}

  async transfere(createTransactionDto: CreateTransactionDto) {
    const {pagador, recebedor} = await this.validaUsuarios(createTransactionDto.pagadorCpf, createTransactionDto.recebedorCpf);
    const valor = createTransactionDto.valor;
    const saldo_pagador = await this.saldoService.subtrai(pagador.cpf_cnpj, valor);
    const saldo_recebedor = await this.saldoService.soma(recebedor.cpf_cnpj, valor);
    const result = await this.transactionsRepository.save(new Transactions(valor, pagador.cpf_cnpj, recebedor.cpf_cnpj));
    return {
      descricao: "Saldos após a transação",
      saldo_pagador: saldo_pagador,
      saldo_recebedor: saldo_recebedor,
      transacao: result
    }
  }

  async findByPagadorCpf(pagadorCpf: number) {
    const pagador = await this.userService.findOneByCpfCnpj(pagadorCpf);
    if(!pagador){
      throw new NotFoundException(`Usuário pagador com cpf ${pagadorCpf} não encontrado`);
    }
    return await this.transactionsRepository.findBy({pagadorCpf: pagadorCpf});
  }

  async findByRecebedorCpf(recebedorCpf: number) {
    const recebedor = await this.userService.findOneByCpfCnpj(recebedorCpf);
    if(!recebedor){
      throw new NotFoundException(`Usuário recebedor com cpf ${recebedorCpf} não encontrado`);
    }
    return await this.transactionsRepository.findBy({recebedorCpf: recebedorCpf});
  }

  async findByUUID(transactionUUID: UUID) {
    const transaction = await this.transactionsRepository.findOneBy({uuid: transactionUUID});
    if(!transaction){
      throw new NotFoundException(`Transação com UUID ${transactionUUID} não encontrada`);
    }
    return transaction;
  }

  async findByDate(date: Date) {
    return await this.transactionsRepository.findOneBy({created_at: date});
  }



  async validaUsuarios(pagadorCpf: number, recebedorCpf: number){
    const pagador = await this.userService.findOneByCpfCnpj(pagadorCpf);
    if(!pagador){
      throw new NotFoundException(`Usuário pagador com cpf ${pagadorCpf} não encontrado`);
    }
    if(userType.LOJISTA === pagador.user_type){
      throw new UnprocessableEntityException("Lojista não pode ser pagador");
    }

    const recebedor = await this.userService.findOneByCpfCnpj(recebedorCpf);
    if(!recebedor){
      throw new NotFoundException(`Usuário recebedor com cpf ${recebedorCpf} não encontrado`);
    }

    return {pagador, recebedor};
  }

}
