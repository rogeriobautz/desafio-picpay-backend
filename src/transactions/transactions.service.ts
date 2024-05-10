// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Injectable,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  NotFoundException,
  UnprocessableEntityException,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { UserService } from '../user/user.service';
import { userType } from '../user/enum/user.type.enum';
import { SaldoService } from '../saldo/saldo.service';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DataSource, Repository } from 'typeorm';
import { Transactions } from './entities/transactions.entity';
import { AbstractTypeOrmTransactionsService } from '../common/abstract-typeorm-transactions.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionsService extends AbstractTypeOrmTransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    private userService: UserService,
    private saldoService: SaldoService,
    private dataSource: DataSource,
    private readonly httpService: HttpService,
  ) {
    super(dataSource);
  }

  async transfere(dto: CreateTransactionDto) {
    try {
      await this.startTransaction();
      await this.validaUsuarios(dto.pagadorCpf, dto.recebedorCpf);
      const saldoRecebedorPosTransacao = await this.saldoService.soma(
        dto.recebedorCpf,
        dto.valor,
      );
      const saldoPagadorPosTransacao = await this.saldoService.subtrai(
        dto.pagadorCpf,
        dto.valor,
      );
      const transacao = await this.transactionsRepository.save(
        new Transactions(dto.valor, dto.pagadorCpf, dto.recebedorCpf),
      );
      await this.autorizadorExterno();
      await this.enviaNotificacao();
      await this.commitTransaction();
      return {
        descricao: 'Saldos após a transação',
        transacao: transacao,
        saldoPagador: saldoPagadorPosTransacao.valor,
        saldoRecebedor: saldoRecebedorPosTransacao.valor,
      };
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    } finally {
      await this.endTransaction();
    }
  }

  async autorizadorExterno() {
    const { data } = await firstValueFrom(
      this.httpService.get(
        'https://run.mocky.io/v3/5794d450-d2e2-4412-8131-73d0293ac1cc',
      ),
    );
    if ('Autorizado' != data.message) {
      throw new UnauthorizedException(
        'Transação negada pelo autorizador externo',
      );
    }
  }

  async enviaNotificacao() {
    const { data } = await firstValueFrom(
      this.httpService.get(
        'https://run.mocky.io/v3/54dc2cf1-3add-45b5-b5a9-6bf7e7f1f4a6',
      ),
    );
    if (true != data.message) {
      throw new UnauthorizedException('Serviço de notificação indisponível');
    }
  }

  async findByPagadorCpf(pagadorCpf: number) {
    const pagador = await this.userService.findOneByCpfCnpj(pagadorCpf);
    if (!pagador) {
      throw new NotFoundException(
        `Usuário pagador com cpf ${pagadorCpf} não encontrado`,
      );
    }
    return await this.transactionsRepository.find({
      where: { pagadorCpf: pagadorCpf },
    });
  }

  async findByRecebedorCpf(recebedorCpf: number) {
    const recebedor = await this.userService.findOneByCpfCnpj(recebedorCpf);
    if (!recebedor) {
      throw new NotFoundException(
        `Usuário recebedor com cpf ${recebedorCpf} não encontrado`,
      );
    }
    return await this.transactionsRepository.find({
      where: { recebedorCpf: recebedorCpf },
    });
  }

  async findByUUID(transactionUUID: string) {
    const transaction = await this.transactionsRepository.findOne({
      where: { uuid: transactionUUID },
    });
    if (!transaction) {
      throw new NotFoundException(
        `Transação com UUID ${transactionUUID} não encontrada`,
      );
    }
    return transaction;
  }

  async findByDate(date: Date) {
    return await this.transactionsRepository.findOne({
      where: { createdAt: date },
    });
  }

  async findAll() {
    return await this.transactionsRepository.find();
  }

  async validaUsuarios(pagadorCpf: number, recebedorCpf: number) {
    const pagador = (await this.userService.findOneByCpfCnpj(pagadorCpf)).user;
    if (!pagador) {
      throw new NotFoundException(
        `Usuário pagador com cpf ${pagadorCpf} não encontrado`,
      );
    }
    if (userType.LOJISTA === pagador.userType) {
      throw new UnprocessableEntityException('Lojista não pode ser pagador');
    }

    const recebedor = (await this.userService.findOneByCpfCnpj(recebedorCpf))
      .user;
    if (!recebedor) {
      throw new NotFoundException(
        `Usuário recebedor com cpf ${recebedorCpf} não encontrado`,
      );
    }

    return { pagador, recebedor };
  }
}
