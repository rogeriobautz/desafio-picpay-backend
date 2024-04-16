import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, Query, ParseIntPipe, BadRequestException, Req, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return {usuarioCriado: await this.userService.create(createUserDto)};
  }

  @Get('find/all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('find/:cpfCnpj')
  async getUser(@Param('cpfCnpj') cpfCnpj: number) {
    return await this.userService.findUserByCpfCnpj(cpfCnpj);
  }
  
  @Patch('update/:cpfCnpj')
  updateUser(@Body() updateUserDto: UpdateUserDto, @Param('cpfCnpj') cpfCnpj: number) {
      return this.userService.update(cpfCnpj, updateUserDto);
  }

  @Delete('delete/:cpfCnpj')
  remove(@Param('cpfcnpj', ParseIntPipe) cpfCnpj?: number) {
    return this.userService.remove(+cpfCnpj);
  }
}
