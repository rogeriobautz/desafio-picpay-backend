import { Module } from '@nestjs/common';
import { TesteDb2Service } from './teste.db2.service';
import { TesteDb2Controller } from './teste.db2.controller';
import { Db2ConfigService } from 'src/config/db2.config.service';
import { TesteDb2Repository } from './teste.db2.repository';

@Module({
  controllers: [TesteDb2Controller],
  providers: [TesteDb2Service, Db2ConfigService, TesteDb2Repository],
})
export class TesteDb2Module {}
