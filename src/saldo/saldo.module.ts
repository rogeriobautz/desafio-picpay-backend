import { Module } from '@nestjs/common';
import { SaldoService } from './saldo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saldo } from './entities/saldo.entity';
import { SaldoController } from './saldo.controller';

@Module({
  imports:[TypeOrmModule.forFeature([Saldo])],
  providers: [SaldoService],
  exports: [SaldoService],
  controllers: [SaldoController]
})
export class SaldoModule {}
