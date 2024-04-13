import { Injectable, UnprocessableEntityException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Saldo } from './entities/saldo.entity';

@Injectable()
export class SaldoService {
  constructor(@InjectRepository(Saldo) private saldoRepository: Repository<Saldo>) { }

  async create(cpf_cnpj: number, valor: number) {
    const saldo = new Saldo(cpf_cnpj, valor);
    return await this.saldoRepository.save(saldo);
  }

  async soma(cpf_cnpj: number, valor: number): Promise<Saldo> {
    const saldo = await this.findByCpfCnpj(cpf_cnpj);
    saldo.valor += valor;
    await this.saldoRepository.update({ cpf_cnpj: cpf_cnpj }, saldo);
    return saldo;
  }

  async subtrai(cpf_cnpj: number, valor: number): Promise<Saldo> {
    const saldo = await this.findByCpfCnpj(cpf_cnpj);
    const valor_saldo_futuro = saldo.valor - valor;
    if (valor_saldo_futuro < 0) {
      throw new UnprocessableEntityException(`Saldo atual insuficiente (Saldo R$${saldo.valor} | Valor requisitado R$${valor})`);
    }
    saldo.valor = valor_saldo_futuro;
    await this.saldoRepository.update({ cpf_cnpj: cpf_cnpj }, saldo);
    return saldo;
  }

  async findByCpfCnpj(cpf_cnpj: number): Promise<Saldo> {
    const saldo = await this.saldoRepository.findOneBy({ cpf_cnpj: cpf_cnpj });
    if (saldo == null) {
      throw new NotFoundException(`Saldo relacionado ao CPF/CNPJ ${cpf_cnpj} não encontrado`);
    }
    return saldo;
  }

  async findAll(): Promise<Saldo[]> {
    return await this.saldoRepository.find();
  }

  async delete(cpf_cnpj: number) {
    const saldo = await this.findByCpfCnpj(cpf_cnpj);
    const result = await this.saldoRepository.delete({ cpf_cnpj: cpf_cnpj });
    if (result.affected == 0) {
      throw new InternalServerErrorException(`Não foi possível deletar o saldo com CPF/CNPJ ${cpf_cnpj}`);
    }
    else {
      return { saldo_deletado: saldo };
    }
  }


}