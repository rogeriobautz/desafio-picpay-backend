import { TesteDb2Repository } from './teste.db2.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CreateTesteDb2Dto } from './dto/create-teste.db2.dto';
import { UpdateTesteDb2Dto } from './dto/update-teste.db2.dto';
import { Db2ConfigService } from 'src/config/db2.config.service';

@Injectable()
export class TesteDb2Service {
  constructor(@Inject(TesteDb2Repository) private testeDb2Repository: TesteDb2Repository) {}
  
  
  async selectAll(){    
    return await this.testeDb2Repository.selectAll();    
  }
  
  async selectByConsent(consent: number){    
    const result = await this.testeDb2Repository.selectByConsent(consent);
    return result.length ? result : `Nenhuma transação encontrada para o consentimento ${consent}`;
  }
  
  async getConsentsList(){    
    const result:any[] = await this.testeDb2Repository.getConsentsList();
    return result.map(consent => consent['CONSENT']);
  }

}
