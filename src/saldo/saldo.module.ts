import { Module } from '@nestjs/common';
import { SaldoService } from './saldo.service';

@Module({
  providers: [SaldoService],
})
export class SaldoModule {}
