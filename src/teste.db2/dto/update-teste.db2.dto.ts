import { PartialType } from '@nestjs/swagger';
import { CreateTesteDb2Dto } from './create-teste.db2.dto';

export class UpdateTesteDb2Dto extends PartialType(CreateTesteDb2Dto) {}
