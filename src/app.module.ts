import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { SiigoModule } from './siigo/siigo.module';
import { ExcelModule } from './excel/excel.module';
import { PayrollModule } from './payroll/payroll.module';
import { ProvisionsModule } from './provisions/provisions.module';

@Module({
  imports: [
    ConfigModule,
    SiigoModule,
    ExcelModule,
    PayrollModule,
    ProvisionsModule,
  ],
})
export class AppModule {}
