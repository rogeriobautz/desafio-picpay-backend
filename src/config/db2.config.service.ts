import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as db2 from 'ibm_db';// Import DB2 driver
import { Db2StateEnum } from './db2.state.enum';

@Injectable()
export class Db2ConfigService {
  constructor(private configService: ConfigService) { }

  private connection; 

  private async openConnection() {
    const host = this.configService.get("DB_HOSTNAME");
    const port = this.configService.get("DB_PORT");
    const database = this.configService.get("DB_DATABASE");
    const user = this.configService.get("DB_UID");
    const password = this.configService.get("DB_PWD");

    const connectionString = `DATABASE=${database};HOSTNAME=${host};UID=${user};PWD=${password};PORT=${port};PROTOCOL=TCPIP`;

    this.connection = await db2.open(connectionString);
    return this.connection;
  }

  public async getConnection() {
    return this.connection != null ? this.connection : await this.openConnection();
  }

  public async closeConnection() {
    db2.close(this.connection);
    //this.connection.close();
  }

  public async isDatabaseConnectonWorking(): Promise<boolean> {
    try {
      await this.getConnection();
      await this.closeConnection();
      console.log("Database connection sucessfull");
      return true;
    }catch(e){
      console.log("Database connection failed");
      console.log(e);
      return false;
    }

  }

  //Declaring empty methods before development
  private checkSchemaExists(schema: string): boolean {
    return false;
  }
  private checkTableExists(table: string): boolean {
    return false;
  }
  public async checkSchemaAndTableExists(schema: string, table: string) {
    const schemaQuery = `SELECT SCHEMANAME FROM SYSIBM.SYSSCHEMAS;`
    const sqlQuery = `SELECT COUNT(*) AS table_exists FROM SYSIBM.SYSTABLES WHERE CREATOR = ${schema} AND NAME = ${table}`;
    console.log(sqlQuery);
    try {
      const conn = await this.getConnection();
      console.log("Schemas", await conn.query(schemaQuery));
      return await conn.query(sqlQuery);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public getTablesNames() {
    const tables = this.configService.get("DB_TABLES").split(',');
    console.log(tables);
    const [schema, table] = tables[0].split('.');
    this.checkSchemaAndTableExists(schema, table);
    return tables;
  }
  public checkDatabase(){
    if(!this.isDatabaseConnectonWorking()){
      return Db2StateEnum.DATABASE_CONNECTION_FAILED;
    }
    return this.getTablesNames();
    

  }



}




