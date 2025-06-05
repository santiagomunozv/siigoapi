import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { ExcelModule } from '../excel/excel.module';
import { SiigoModule } from '../siigo/siigo.module';

@Module({
  imports: [ExcelModule, SiigoModule],
  providers: [PayrollService],
  controllers: [PayrollController],
})
export class PayrollModule {}
