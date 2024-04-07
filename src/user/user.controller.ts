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

  @Get('find/all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('find/:cpf_cnpj')
  async getUser(@Param('cpf_cnpj') cpf_cnpj: number) {
    return await this.userService.findUserByCpfCnpj(cpf_cnpj);
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
