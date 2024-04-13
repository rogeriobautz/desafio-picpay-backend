import { Module } from '@nestjs/common';
import { SaldoService } from './saldo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saldo } from './entities/saldo.entity';
import { SaldoController } from './saldo.controller';
import { Db2ConfigService } from 'src/config/db2.config.service';

@Module({
  imports:[TypeOrmModule.forFeature([Saldo])],
  providers: [SaldoService],
  exports: [SaldoService],
  controllers: [SaldoController]
})
export class SaldoModule {}
