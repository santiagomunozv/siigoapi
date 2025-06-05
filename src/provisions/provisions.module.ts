import { Module } from '@nestjs/common';
import { ProvisionsService } from './provisions.service';
import { ProvisionsController } from './provisions.controller';
import { ExcelModule } from '../excel/excel.module';
import { SiigoModule } from '../siigo/siigo.module';

@Module({
  imports: [ExcelModule, SiigoModule],
  providers: [ProvisionsService],
  controllers: [ProvisionsController],
})
export class ProvisionsModule {}
