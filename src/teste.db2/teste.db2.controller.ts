import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TesteDb2Service } from './teste.db2.service';

@Controller('teste-db2')
export class TesteDb2Controller {
  constructor(private readonly testeDb2Service: TesteDb2Service) {}
  
  @Get('all')
  async selectAll(){
      return await this.testeDb2Service.selectAll();      
  }
  
  @Get('consent/all')
  async getConsentsList(){
      return await this.testeDb2Service.getConsentsList();      
  }
  
  @Get('consent/:consent')
  async getByConsent(@Param('consent') consent: number){
      return await this.testeDb2Service.selectByConsent(consent);      
  }

}
