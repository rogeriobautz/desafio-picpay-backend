import { Inject, Injectable } from '@nestjs/common';
import { Db2ConfigService } from 'src/config/db2.config.service';
import {Database} from 'ibm_db';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TesteDb2Repository {
  constructor(
    private configService: ConfigService,
    @Inject(Db2ConfigService) private db2ConfigService: Db2ConfigService
  ) {}

  private connection:Database;
  private tabela = (this.configService.get('DB_SCHEMA') || 'CONTA') + '.' + (this.configService.get('DB_TABLE') || 'EXTRATO');

  public async getConnection(){
    if(!this.connection){
      this.connection = await this.db2ConfigService.getConnection();
    }
    return this.connection;
  }

  async execute(queryString:string){
    try {
      const conn = await this.getConnection();
      return await conn.query(queryString);      
    } catch (error) {
      return error;
    }
  }

  async selectAll(){
    const queryString:string = `SELECT * FROM ${this.tabela}`;
    return await this.execute(queryString);
  }

  async selectByConsent(consent: number){
    const queryString:string = `SELECT * FROM ${this.tabela} WHERE CONSENT = ${consent}`;
    return await this.execute(queryString);
  }

  async getConsentsList(){
    const queryString:string = `SELECT CONSENT FROM ${this.tabela}`;
    return await this.execute(queryString);
  }

}
