import { ExcelService } from "../excel/excel.service";
import { SiigoService } from "../siigo/siigo.service";
export declare class PayrollService {
    private readonly excelService;
    private readonly siigoService;
    private readonly logger;
    constructor(excelService: ExcelService, siigoService: SiigoService);
    processPayrollTemplate(filePath: string, sheetName: string): Promise<void>;
    private buildVoucherPayload;
    private buildExpensePayload;
}
