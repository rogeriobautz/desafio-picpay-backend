import { Test, TestingModule } from '@nestjs/testing';
import { TesteDb2Service } from './teste.db2.service';

describe('TesteDb2Service', () => {
  let service: TesteDb2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TesteDb2Service],
    }).compile();

    service = module.get<TesteDb2Service>(TesteDb2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
