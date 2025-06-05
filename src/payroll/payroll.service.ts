import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { ExcelService } from "../excel/excel.service";
import { SiigoService } from "../siigo/siigo.service";
import { PayrollRowDto } from "./dto/payroll-row.dto";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";

@Injectable()
export class PayrollService {
  private readonly logger = new Logger(PayrollService.name);

  constructor(
    private readonly excelService: ExcelService,
    private readonly siigoService: SiigoService
  ) {}

  /**
   * Procesa la plantilla de nómina: lee el Excel, valida filas y crea
   * comprobantes contables y egresos para cada empleado.
   * @param filePath Ruta al archivo de nómina
   * @param sheetName Nombre de la hoja en Excel
   */
  async processPayrollTemplate(filePath: string, sheetName: string) {
    // 1) Leer filas desde Excel
    const rawRows: any[] = await this.excelService.readSheet(
      filePath,
      sheetName
    );

    // 2) Validar y mapear cada fila a PayrollRowDto
    for (const rawRow of rawRows) {
      const dto = plainToClass(PayrollRowDto, rawRow);
      try {
        await validateOrReject(dto);
      } catch (errors) {
        this.logger.error(
          `Fila inválida en nómina: ${JSON.stringify(rawRow)} - Errores: ${errors}`
        );
        continue; // omite filas inválidas
      }

      // 3) Construir payload para comprobante contable
      const voucherPayload = this.buildVoucherPayload(dto);
      // 4) Llamar a Siigo para crear comprobante
      try {
        const voucherResult =
          await this.siigoService.createVoucher(voucherPayload);
        this.logger.log(
          `Comprobante creado para empleado ${dto.employeeId}: ${voucherResult.id}`
        );
      } catch (error: any) {
        this.logger.error(
          `Error al crear comprobante para ${dto.employeeId}: ${error.message}`
        );
        continue; // si falla un comprobante, seguimos con el siguiente empleado
      }

      // 5) Construir payload para egreso
      const expensePayload = this.buildExpensePayload(dto);
      // 6) Llamar a Siigo para crear egreso
      try {
        const expenseResult =
          await this.siigoService.createExpense(expensePayload);
        this.logger.log(
          `Egreso creado para empleado ${dto.employeeId}: ${expenseResult.id}`
        );
      } catch (error: any) {
        this.logger.error(
          `Error al crear egreso para ${dto.employeeId}: ${error.message}`
        );
      }
    }
  }

  private buildVoucherPayload(dto: PayrollRowDto): any {
    // Mapea dto a la estructura que espera el endpoint de Siigo.
    // Ejemplo simplificado; adapta según la documentación de Siigo.
    return {
      date: new Date().toISOString().split("T")[0], // por ejemplo: "2025-06-04"
      description: `Pago nómina a ${dto.employeeName}`,
      lines: [
        {
          account: "5125", // cuenta bancaria (ejemplo)
          debit: 0,
          credit: dto.netSalary,
        },
        {
          account: "5105", // cuenta de gastos de nómina (ejemplo)
          debit: dto.netSalary,
          credit: 0,
        },
      ],
    };
  }

  private buildExpensePayload(dto: PayrollRowDto): any {
    // Ejemplo de cómo podría lucir el payload para crear un egreso.
    return {
      date: new Date().toISOString().split("T")[0],
      account: "1105", // cuenta caja/bancos (ejemplo)
      amount: dto.netSalary,
      description: `Egreso nómina a ${dto.employeeName}`,
      // …otros campos obligatorios por Siigo
    };
  }
}
