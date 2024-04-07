import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository, Transaction } from 'typeorm';
import { SaldoService } from 'src/saldo/saldo.service';
import { AbstractTypeOrmTransactionsService } from 'src/common/abstract-typeorm-transactions.service';

@Injectable()
export class UserService extends AbstractTypeOrmTransactionsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, private readonly saldoService: SaldoService,
    private dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      this.startTransaction();
      await this.cpfnCnpjExists(createUserDto.cpf_cnpj);
      await this.emailExists(createUserDto.email);
      const saldo = await this.saldoService.create(createUserDto.cpf_cnpj, createUserDto.valor_saldo == null ? 0 : createUserDto.valor_saldo);
      const user = new User(
        createUserDto.nome,
        createUserDto.cpf_cnpj,
        createUserDto.email,
        createUserDto.senha,
        createUserDto.user_type
      );
      const saved_user = await this.userRepository.save(user);
      this.commitTransaction();
      return { user: saved_user, saldo };
    }
    catch (error) {
      this.rollbackTransaction();
      throw error;
    }
    finally {
      this.endTransaction();
    }
  }

  async cpfnCnpjExists(cpf_cnpj: number) {
    if ((await this.findOneByCpfCnpj(cpf_cnpj))) {
      throw new ConflictException(`Já existe um usuário associado ao CPF/CNPJ ${cpf_cnpj}`);
    }
  }

  async emailExists(email: string) {
    if ((await this.findByEmail(email))) {
      throw new ConflictException(`Já existe um usuário associado ao e-mail ${email}`);
    }
  }

  async findAll() {
    const users =  await this.userRepository.find()
    return await this.adicionaSaldo(users);
  }

 /*  async findAllByQuery() {
    const queryBuilder = await this.userRepository.createQueryBuilder();
  } */

  async adicionaSaldo(users: User[] ){
    return await Promise.all(users.map(async (user) => {
      const saldo = await this.saldoService.findByCpfCnpj(user.cpf_cnpj);
      return {user, saldo};
    }));
  }

  async findOneByCpfCnpj(cpf_cnpj: number) {
    const user =  await this.userRepository.findOneBy({ cpf_cnpj: cpf_cnpj });
    return (await this.adicionaSaldo([user]))[0];
  }

  async findUserByCpfCnpj(cpf_cnpj: number) {
    const user = await this.userRepository.findOneBy({ cpf_cnpj: cpf_cnpj });
    if (user === null) {
      throw new NotFoundException(`Nenhum usuário com o Cpf/Cnpj ${cpf_cnpj} encontrado`);
    }
    return (await this.adicionaSaldo([user]))[0];
  }

  async update(cpf_cnpj: number, updateUserDto: UpdateUserDto) {
    if (cpf_cnpj != null) {
      return this.updateByCpfCnpj(+cpf_cnpj, updateUserDto);
    }
  }

  async updateByCpfCnpj(cpf_cnpj: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update({ cpf_cnpj: cpf_cnpj }, updateUserDto,);
    if (result.affected === 0) {
      throw new NotFoundException("Usuário não encontrado");
    }
    else {
      return { usuario_atualizado: (await this.findOneByCpfCnpj(cpf_cnpj)) };
    }
  }

  async remove(cpf_cnpj: number) {
    const usuario = await this.findOneByCpfCnpj(cpf_cnpj);
    if (usuario == null) {
      throw new NotFoundException(`Usuário com CPF/CNPJ ${cpf_cnpj} não encontrado`);
    }
    const saldo = await this.saldoService.findByCpfCnpj(cpf_cnpj);
    if (saldo != null && saldo.valor > 0) {
      throw new UnprocessableEntityException(`Não é possível deletar um usuário com saldo em conta: CPF/CNPJ ${cpf_cnpj} | Saldo: R$${saldo.valor}`);
    }
    const result = await this.userRepository.delete({ cpf_cnpj: cpf_cnpj });
    if (result.affected == 0) {
      throw new InternalServerErrorException(`Não foi possível deletar o usuário com CPF/CNPJ ${cpf_cnpj}`);
    }
    else {
      return { usuario_deletado: usuario };
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email: email });
  }
}
