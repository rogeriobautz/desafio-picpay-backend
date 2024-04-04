import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, Query, ParseIntPipe, BadRequestException, Req, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from './dto/query-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return {usuario_criado: await this.userService.create(createUserDto)};
  }

  @Get()
  async getUser(@Body() updateUserDto: UpdateUserDto, @Query() query: QueryDto) {
    return {usuario_criado: await this.userService.findByQuery(query)};
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  
  @Patch('update')
  updateUser(@Body() updateUserDto: UpdateUserDto, @Query() query: QueryDto) {
      return this.userService.update(query, updateUserDto);
  }

  @Delete('delete')
  remove(@Query('cpfcnpj', ParseIntPipe) cpf_cnpj?: number) {
    return this.userService.remove(+cpf_cnpj);
  }
}
