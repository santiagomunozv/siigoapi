import { PayrollService } from "./payroll.service";
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    uploadPayrollFile(file: Express.Multer.File): Promise<{
        message: string;
    }>;
}
