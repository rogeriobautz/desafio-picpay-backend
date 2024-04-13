import { Test, TestingModule } from '@nestjs/testing';
import { TesteDb2Controller } from './teste.db2.controller';
import { TesteDb2Service } from './teste.db2.service';

describe('TesteDb2Controller', () => {
  let controller: TesteDb2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TesteDb2Controller],
      providers: [TesteDb2Service],
    }).compile();

    controller = module.get<TesteDb2Controller>(TesteDb2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
