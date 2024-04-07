import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmDataSourceFactory } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export abstract class AbstractTypeOrmTransactionsService {

  private queryRunner:QueryRunner | null = null;
  private dataSourceAbstract:DataSource | null = null;

  constructor(dataSource) {
    this.dataSourceAbstract = dataSource;
   }

  async startTransaction() {
    this.queryRunner = this.dataSourceAbstract.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commitTransaction() {
    await this.queryRunner.commitTransaction();
  }

  async rollbackTransaction() {
    await this.queryRunner.rollbackTransaction();
  }

  async endTransaction() {
    await this.queryRunner.release();
  }

}
