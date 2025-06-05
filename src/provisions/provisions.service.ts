import { Injectable, Logger } from "@nestjs/common";
import { ExcelService } from "../excel/excel.service";
import { SiigoService } from "../siigo/siigo.service";
import { ProvisionRowDto } from "./dto/provision-row.dto";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";

@Injectable()
export class ProvisionsService {
  private readonly logger = new Logger(ProvisionsService.name);

  constructor(
    private readonly excelService: ExcelService,
    private readonly siigoService: SiigoService
  ) {}

  /**
   * Procesa la plantilla de provisiones: lee el Excel, valida filas y crea
   * comprobantes contables en Siigo.
   * @param filePath Ruta al archivo de provisiones
   * @param sheetName Nombre de la hoja en Excel
   */
  async processProvisionsTemplate(filePath: string, sheetName: string) {
    const rawRows: any[] = await this.excelService.readSheet(
      filePath,
      sheetName
    );

    for (const rawRow of rawRows) {
      const dto = plainToClass(ProvisionRowDto, rawRow);
      try {
        await validateOrReject(dto);
      } catch (errors) {
        this.logger.error(
          `Fila inválida en provisiones: ${JSON.stringify(rawRow)} - Errores: ${errors}`
        );
        continue;
      }

      const voucherPayload = this.buildProvisionVoucherPayload(dto);
      try {
        const voucherResult =
          await this.siigoService.createVoucher(voucherPayload);
        this.logger.log(`Comprobante de provisión creado: ${voucherResult.id}`);
      } catch (error: any) {
        this.logger.error(
          `Error al crear comprobante de provisión (fila: ${JSON.stringify(dto)}): ${error.message}`
        );
      }
    }
  }

  private buildProvisionVoucherPayload(dto: ProvisionRowDto): any {
    // Mapear dto a la estructura que espera Siigo para provisiones.
    return {
      date: new Date().toISOString().split("T")[0],
      description: dto.description || `Provisión cuenta ${dto.accountCode}`,
      lines: [
        {
          account: dto.accountCode,
          debit: dto.amount,
          credit: 0,
        },
        {
          account: "2205", // Ejemplo de cuenta contraparte
          debit: 0,
          credit: dto.amount,
        },
      ],
    };
  }
}
