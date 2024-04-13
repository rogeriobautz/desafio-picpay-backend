import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as db2 from 'ibm_db';// Import DB2 driver

@Injectable()
export class Db2ConfigService {
  constructor(private configService: ConfigService) {}

  private connection;

  private async openConnection(){
    const host = this.configService.get("DB_HOSTNAME");
    const port = this.configService.get("DB_PORT");
    const database = this.configService.get("DB_DATABASE");
    const user = this.configService.get("DB_UID");
    const password = this.configService.get("DB_PWD");
    
    const connectionString = `DATABASE=${database};HOSTNAME=${host};UID=${user};PWD=${password};PORT=${port};PROTOCOL=TCPIP`;

    this.connection = await db2.open(connectionString);
    return this.connection;
  }  

  public async getConnection(){
    return this.connection != null ? this.connection : await this.openConnection();
  }

  public async closeConnection(){
    db2.close(this.connection);
    //this.connection.close();
  }  
}




