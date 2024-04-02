import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteConfigService } from './config/sqlite.config.service';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),
    TypeOrmModule.forRootAsync({
      useClass: SqlLiteConfigService,
      inject: [SqlLiteConfigService],
    }),
    TransactionModule,
    UserModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
