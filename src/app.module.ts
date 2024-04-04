import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteConfigService } from './config/sqlite.config.service';
import { TransactionModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';
import { SaldoModule } from './saldo/saldo.module';
@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),
    TypeOrmModule.forRootAsync({
      useClass: SqlLiteConfigService,
      inject: [SqlLiteConfigService],
    }),
    TransactionModule,
    UserModule,
    SaldoModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
