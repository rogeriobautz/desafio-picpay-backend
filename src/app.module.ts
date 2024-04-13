import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteConfigService } from './config/sqlite.config.service';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';
import { SaldoModule } from './saldo/saldo.module';
import { Db2ConfigService } from './config/db2.config.service';
import { TesteDb2Module } from './teste.db2/teste.db2.module';
@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),
    TypeOrmModule.forRootAsync({
      useClass: SqlLiteConfigService,
      inject: [SqlLiteConfigService],
    }),
    TransactionsModule,
    UserModule,
    SaldoModule,
    TesteDb2Module,],
  controllers: [AppController],
  providers: [AppService,
    Db2ConfigService]
})
export class AppModule {}
