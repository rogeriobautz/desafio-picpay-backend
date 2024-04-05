import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { UserService } from 'src/user/user.service';
import { userType } from 'src/user/enum/user.type.enum';
import { SaldoService } from 'src/saldo/saldo.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from './entities/transactions.entity';

@Injectable()
export class TransactionsService {

  constructor(
    private userService: UserService, 
    private saldoService: SaldoService,
    @InjectRepository(Transactions) private readonly transactionsRepository: Repository<Transactions>
  ) {}

  async transfere(createTransactionDto: CreateTransactionDto) {
    const { pagador, recebedor } = await this.validaUsuarios(createTransactionDto.pagadorCpf, createTransactionDto.recebedorCpf);
    const valor = createTransactionDto.valor;
    const saldo_pagador = await this.saldoService.subtrai(pagador.cpf_cnpj, valor);
    const saldo_recebedor = await this.saldoService.soma(recebedor.cpf_cnpj, valor);
    const transaction = this.transactionsRepository.create({
      valor,
      pagadorCpf: pagador.cpf_cnpj,
      recebedorCpf: recebedor.cpf_cnpj
    });
    const result = await this.transactionsRepository.save(transaction);
    return {
      descricao: "Saldos após a transação",
      saldo_pagador,
      saldo_recebedor,
      transacao: result
    };
  }

  async findByPagadorCpf(pagadorCpf: number) {
    const pagador = await this.userService.findOneByCpfCnpj(pagadorCpf);
    if (!pagador) {
      throw new NotFoundException(`Usuário pagador com cpf ${pagadorCpf} não encontrado`);
    }
    return await this.transactionsRepository.find({ where: { pagadorCpf: pagadorCpf } });
  }

  async findByRecebedorCpf(recebedorCpf: number) {
    const recebedor = await this.userService.findOneByCpfCnpj(recebedorCpf);
    if (!recebedor) {
      throw new NotFoundException(`Usuário recebedor com cpf ${recebedorCpf} não encontrado`);
    }
    return await this.transactionsRepository.find({ where: { recebedorCpf: recebedorCpf } });
  }

  async findByUUID(transactionUUID: string) {
    const transaction = await this.transactionsRepository.findOne({ where: { uuid: transactionUUID } });
    if (!transaction) {
      throw new NotFoundException(`Transação com UUID ${transactionUUID} não encontrada`);
    }
    return transaction;
  }

  async findByDate(date: Date) {
    return await this.transactionsRepository.findOne({ where: { created_at: date } });
  }

  async validaUsuarios(pagadorCpf: number, recebedorCpf: number) {
    const pagador = await this.userService.findOneByCpfCnpj(pagadorCpf);
    if (!pagador) {
      throw new NotFoundException(`Usuário pagador com cpf ${pagadorCpf} não encontrado`);
    }
    if (userType.LOJISTA === pagador.user_type) {
      throw new UnprocessableEntityException("Lojista não pode ser pagador");
    }

    const recebedor = await this.userService.findOneByCpfCnpj(recebedorCpf);
    if (!recebedor) {
      throw new NotFoundException(`Usuário recebedor com cpf ${recebedorCpf} não encontrado`);
    }

    return { pagador, recebedor };
  }

}
