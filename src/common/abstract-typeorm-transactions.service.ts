import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

export abstract class AbstractTypeOrmTransactionsService {

  private queryRunner:QueryRunner | null = null;
  private dataSourceAbstract:DataSource | null = null;

  constructor(dataSource) {
    this.dataSourceAbstract = dataSource;
   }

  async startTransaction() {
    this.queryRunner = this.dataSourceAbstract.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction('SERIALIZABLE');
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
