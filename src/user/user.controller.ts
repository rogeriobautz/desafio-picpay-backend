import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, Query, ParseIntPipe, BadRequestException, Req, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return {usuario_criado: await this.userService.create(createUserDto)};
  }

  @Get('find/:cpf_cnpj')
  async getUser(@Param('cpf_cnpj') cpf_cnpj: number) {
    return {usuario_criado: await this.userService.findOneByCpfCnpj(cpf_cnpj)};
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  
  @Patch('update/:cpf_cnpj')
  updateUser(@Body() updateUserDto: UpdateUserDto, @Param('cpf_cnpj') cpf_cnpj: number) {
      return this.userService.update(cpf_cnpj, updateUserDto);
  }

  @Delete('delete/:cpf_cnpj')
  remove(@Param('cpfcnpj', ParseIntPipe) cpf_cnpj?: number) {
    return this.userService.remove(+cpf_cnpj);
  }
}
