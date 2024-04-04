import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Http2ServerResponse } from 'http2';
import { QueryDto } from './dto/query-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    await this.cpfnCnpjExists(createUserDto.cpf_cnpj);
    await this.emailExists(createUserDto.email);
    return await this.userRepository.save(
      new User(
        createUserDto.nome,
        createUserDto.cpf_cnpj,
        createUserDto.email,
        createUserDto.senha,
        createUserDto.user_type,
      ),
    );
  }

  async cpfnCnpjExists(cpf_cnpj: number) {
    if ((await this.findOneByCpfCnpj(cpf_cnpj))) {
      throw new ConflictException( `Já existe um usuário associado ao CPF/CNPJ ${cpf_cnpj}`);
    }
  }

  async emailExists(email: string) {
    if ((await this.findByEmail(email))) {
      throw new ConflictException(`Já existe um usuário associado ao e-mail ${email}`);
    }
  }

  async findByQuery(query: QueryDto) {
    console.log(query);
    if (query.cpf_cnpj != null) {
      return await this.findOneByCpfCnpj(query.cpf_cnpj);
    }
    if (query.email != null) {
      return this.findByEmail(query.email);
    }
    throw new BadRequestException('Parâmetros inválidos ou insuficientes');
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async update(query: QueryDto, updateUserDto: UpdateUserDto) {
    console.log(query);
    if (query.cpf_cnpj != null) {
      return this.updateByCpfCnpj(+query.cpf_cnpj, updateUserDto);
    }
    if (query.email != null) {
      return this.updateByEmail(query.email, updateUserDto);
    }
    throw new BadRequestException('Parâmetros inválidos ou insuficientes');
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

  async updateByEmail(email: string, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update({ email: email }, updateUserDto,);
    if (result.affected === 0) {
      throw new NotFoundException("Usuário não encontrado");
    }
    else {
      return { usuario_atualizado: (await this.findByEmail(email))[0] };
    }
  }

  async remove(cpf_cnpj: number) {
    const usuario = await this.findOneByCpfCnpj(cpf_cnpj);
    if (usuario == null) {
      throw new NotFoundException(`Usuário com CPF/CNPJ ${cpf_cnpj} não encontrado`);
    }
    const result = await this.userRepository.delete({ cpf_cnpj: cpf_cnpj });
    if (result.affected == 0) {
      throw new InternalServerErrorException(`Não foi possível deletar o usuário com CPF/CNPJ ${cpf_cnpj}`);
    }
    else {
      return { usuario_deletado: usuario };
    }
  }

  async findOneByCpfCnpj(cpf_cnpj: number) {
    return await this.userRepository.findOneBy({ cpf_cnpj: cpf_cnpj });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email: email });
  }
}
