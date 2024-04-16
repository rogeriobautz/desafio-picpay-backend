import { Injectable, UnprocessableEntityException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Saldo } from './entities/saldo.entity';

@Injectable()
export class SaldoService {
  constructor(@InjectRepository(Saldo) private saldoRepository: Repository<Saldo>) { }

  async create(cpfCnpj: number, valor: number) {
    const saldo = new Saldo(cpfCnpj, valor);
    return await this.saldoRepository.save(saldo);
  }

  async soma(cpfCnpj: number, valor: number): Promise<Saldo> {
    const saldo = await this.findByCpfCnpj(cpfCnpj);
    saldo.valor += valor;
    await this.saldoRepository.update({ cpfCnpj: cpfCnpj }, saldo);
    return saldo;
  }

  async subtrai(cpfCnpj: number, valor: number): Promise<Saldo> {
    const saldo = await this.findByCpfCnpj(cpfCnpj);
    const valorSaldoFuturo = saldo.valor - valor;
    if (valorSaldoFuturo < 0) {
      throw new UnprocessableEntityException(`Saldo atual insuficiente (Saldo R$${saldo.valor} | Valor requisitado R$${valor})`);
    }
    saldo.valor = valorSaldoFuturo;
    await this.saldoRepository.update({ cpfCnpj: cpfCnpj }, saldo);
    return saldo;
  }

  async findByCpfCnpj(cpfCnpj: number): Promise<Saldo> {
    const saldo = await this.saldoRepository.findOneBy({ cpfCnpj: cpfCnpj });
    if (saldo == null) {
      throw new NotFoundException(`Saldo relacionado ao CPF/CNPJ ${cpfCnpj} não encontrado`);
    }
    return saldo;
  }

  async findAll(): Promise<Saldo[]> {
    return await this.saldoRepository.find();
  }

  async delete(cpfCnpj: number) {
    const saldo = await this.findByCpfCnpj(cpfCnpj);
    const result = await this.saldoRepository.delete({ cpfCnpj: cpfCnpj });
    if (result.affected == 0) {
      throw new InternalServerErrorException(`Não foi possível deletar o saldo com CPF/CNPJ ${cpfCnpj}`);
    }
    else {
      return { saldoDeletado: saldo };
    }
  }


}