import { UUID } from 'crypto';
import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException, HttpStatus } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { UserService } from 'src/user/user.service';
import { userType } from 'src/user/enum/user.type.enum';
import { SaldoService } from 'src/saldo/saldo.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository, Transaction } from 'typeorm';
import { Transactions } from './entities/transactions.entity';
import { v4 as uuidv4 } from 'uuid';
import { Saldo } from 'src/saldo/entities/saldo.entity';

@Injectable()
export class TransactionsService {

  constructor(
    private userService: UserService,
    private saldoService: SaldoService,
    private dataSource: DataSource,
    @InjectRepository(Transactions) private readonly transactionsRepository: Repository<Transactions>
  ) { }

  async startTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  async transfere(createTransactionDto: CreateTransactionDto) {
    const { pagador, recebedor } = await this.validaUsuarios(createTransactionDto.pagadorCpf, createTransactionDto.recebedorCpf);
    const valor = createTransactionDto.valor;
    const queryRunner = this.startTransaction();
    try {
      let saldo_pagador = await this.saldoService.findByCpfCnpj(pagador.cpf_cnpj);
      if(saldo_pagador.valor - valor < 0){
        throw new UnprocessableEntityException(`Saldo atual insuficiente (Saldo R$${saldo_pagador.valor} | Valor requisitado R$${valor})`)
      }
      const saldo_pagador_pos_transacao = await (await queryRunner).manager.update(Saldo, { cpf_cnpj: saldo_pagador.cpf_cnpj }, { valor: saldo_pagador.valor - valor });
      const saldo_recebedor = await this.saldoService.findByCpfCnpj(recebedor.cpf_cnpj);
      const saldo_recebedor_pos_transacao = await (await queryRunner).manager.update(Saldo, { cpf_cnpj: saldo_recebedor.cpf_cnpj }, { valor: saldo_recebedor.valor + valor });
      const transaction = await (await queryRunner).manager
        .save(Transactions, { uuid: uuidv4(), valor, pagadorCpf: pagador.cpf_cnpj, recebedorCpf: recebedor.cpf_cnpj });
      (await queryRunner).commitTransaction();
      return {
        descricao: "Saldos após a transação",
        saldo_pagador,
        saldo_recebedor,
        transacao: transaction
      };
    } catch (error) {
      (await queryRunner).rollbackTransaction();
      throw error;
    }
    finally {
      (await queryRunner).release();
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
