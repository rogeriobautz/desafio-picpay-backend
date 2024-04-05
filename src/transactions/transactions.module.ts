import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transactions } from './entities/transactions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
