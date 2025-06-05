import { ExcelService } from "../excel/excel.service";
import { SiigoService } from "../siigo/siigo.service";
export declare class ProvisionsService {
    private readonly excelService;
    private readonly siigoService;
    private readonly logger;
    constructor(excelService: ExcelService, siigoService: SiigoService);
    processProvisionsTemplate(filePath: string, sheetName: string): Promise<void>;
    private buildProvisionVoucherPayload;
}
