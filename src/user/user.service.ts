import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
import { DataSource, Repository } from 'typeorm';
import { SaldoService } from '../saldo/saldo.service';
import { AbstractTypeOrmTransactionsService } from '../common/abstract-typeorm-transactions.service';

@Injectable()
export class UserService extends AbstractTypeOrmTransactionsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly saldoService: SaldoService,
    private dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      await this.startTransaction();
      console.log(createUserDto);
      await this.cpfAndCnpjExists(createUserDto.cpfCnpj);
      await this.emailExists(createUserDto.email);
      const saldo = await this.saldoService.create(
        createUserDto.cpfCnpj,
        createUserDto.valorSaldo == null ? 0 : createUserDto.valorSaldo,
      );
      const user = new User(
        createUserDto.nome,
        createUserDto.cpfCnpj,
        createUserDto.email,
        createUserDto.senha,
        createUserDto.userType,
      );
      const savedUser = await this.userRepository.save(user);
      await this.commitTransaction();
      return { user: savedUser, saldo };
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    } finally {
      await this.endTransaction();
    }
  }

  async cpfAndCnpjExists(cpfCnpj: number) {
    if (await this.findOneByCpfCnpj(cpfCnpj)) {
      throw new ConflictException(
        `Já existe um usuário associado ao CPF/CNPJ ${cpfCnpj}`,
      );
    }
  }

  async emailExists(email: string) {
    if (await this.findByEmail(email)) {
      throw new ConflictException(
        `Já existe um usuário associado ao e-mail ${email}`,
      );
    }
  }

  async findAll() {
    const users = await this.userRepository.find();
    return await this.adicionaSaldo(users);
  }

  /*  async findAllByQuery() {
    const queryBuilder = await this.userRepository.createQueryBuilder();
  } */

  async adicionaSaldo(users: User[]) {
    return await Promise.all(
      users.map(async (user) => {
        const saldo = await this.saldoService.findByCpfCnpj(user.cpfCnpj);
        return { user, saldo };
      }),
    );
  }

  async findOneByCpfCnpj(cpfCnpj: number) {
    const user = await this.userRepository.findOneBy({ cpfCnpj: cpfCnpj });
    return user ? (await this.adicionaSaldo([user]))[0] : null;
  }

  async findUserByCpfCnpj(cpfCnpj: number) {
    const user = await this.userRepository.findOneBy({ cpfCnpj: cpfCnpj });
    if (user === null) {
      throw new NotFoundException(
        `Nenhum usuário com o Cpf/Cnpj ${cpfCnpj} encontrado`,
      );
    }
    return (await this.adicionaSaldo([user]))[0];
  }

  async update(cpfCnpj: number, updateUserDto: UpdateUserDto) {
    if (cpfCnpj != null) {
      return this.updateByCpfCnpj(+cpfCnpj, updateUserDto);
    }
  }

  async updateByCpfCnpj(cpfCnpj: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(
      { cpfCnpj: cpfCnpj },
      updateUserDto,
    );
    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado');
    } else {
      return { usuarioAtualizado: await this.findOneByCpfCnpj(cpfCnpj) };
    }
  }

  async remove(cpfCnpj: number) {
    const usuario = await this.findOneByCpfCnpj(cpfCnpj);
    if (usuario == null) {
      throw new NotFoundException(
        `Usuário com CPF/CNPJ ${cpfCnpj} não encontrado`,
      );
    }
    const saldo = await this.saldoService.findByCpfCnpj(cpfCnpj);
    if (saldo != null && saldo.valor > 0) {
      throw new UnprocessableEntityException(
        `Não é possível deletar um usuário com saldo em conta: CPF/CNPJ ${cpfCnpj} | Saldo: R$${saldo.valor}`,
      );
    }
    const result = await this.userRepository.delete({ cpfCnpj: cpfCnpj });
    if (result.affected == 0) {
      throw new InternalServerErrorException(
        `Não foi possível deletar o usuário com CPF/CNPJ ${cpfCnpj}`,
      );
    } else {
      return { usuarioDeletado: usuario };
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email: email });
  }
}
