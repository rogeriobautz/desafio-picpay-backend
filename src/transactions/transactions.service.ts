import { UUID } from 'crypto';
import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException, HttpStatus } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { UserService } from 'src/user/user.service';
import { userType } from 'src/user/enum/user.type.enum';
import { SaldoService } from 'src/saldo/saldo.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository, Transaction } from 'typeorm';
import { Transactions } from './entities/transactions.entity';
import { AbstractTypeOrmTransactionsService } from 'src/common/abstract-typeorm-transactions.service';

@Injectable()
export class TransactionsService extends AbstractTypeOrmTransactionsService{

  constructor(
    @InjectRepository(Transactions) private readonly transactionsRepository: Repository<Transactions>,
    private userService: UserService,
    private saldoService: SaldoService,
    private dataSource:DataSource
  ) {
    super(dataSource);
  }

  async transfere(dto: CreateTransactionDto) {
    await this.validaUsuarios(dto.pagadorCpf, dto.recebedorCpf);
    this.startTransaction();

    try {
      const saldo_recebedor_pos_soma = await this.saldoService.soma(dto.recebedorCpf, dto.valor);
      const saldo_pagador_pos_subtracao = await this.saldoService.subtrai(dto.pagadorCpf, dto.valor);
      const transaction = await this.transactionsRepository.save(new Transactions(dto.valor, dto.pagadorCpf, dto.recebedorCpf));
      this.commitTransaction();
      return {
        descricao: "Saldos após a transação",
        transacao: transaction,
        saldo_pagador: saldo_pagador_pos_subtracao,
        saldo_recebedor: saldo_recebedor_pos_soma
      };
    } 
    catch (error) {
      this.rollbackTransaction();
      throw error;
    }
    finally {
      this.endTransaction();
    }
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

  async findAll() {
    return await this.transactionsRepository.find();
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
