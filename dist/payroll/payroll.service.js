"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PayrollService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const excel_service_1 = require("../excel/excel.service");
const siigo_service_1 = require("../siigo/siigo.service");
const payroll_row_dto_1 = require("./dto/payroll-row.dto");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let PayrollService = PayrollService_1 = class PayrollService {
    constructor(excelService, siigoService) {
        this.excelService = excelService;
        this.siigoService = siigoService;
        this.logger = new common_1.Logger(PayrollService_1.name);
    }
    async processPayrollTemplate(filePath, sheetName) {
        const rawRows = await this.excelService.readSheet(filePath, sheetName);
        for (const rawRow of rawRows) {
            const dto = (0, class_transformer_1.plainToClass)(payroll_row_dto_1.PayrollRowDto, rawRow);
            try {
                await (0, class_validator_1.validateOrReject)(dto);
            }
            catch (errors) {
                this.logger.error(`Fila inválida en nómina: ${JSON.stringify(rawRow)} - Errores: ${errors}`);
                continue;
            }
            const voucherPayload = this.buildVoucherPayload(dto);
            try {
                const voucherResult = await this.siigoService.createVoucher(voucherPayload);
                this.logger.log(`Comprobante creado para empleado ${dto.employeeId}: ${voucherResult.id}`);
            }
            catch (error) {
                this.logger.error(`Error al crear comprobante para ${dto.employeeId}: ${error.message}`);
                continue;
            }
            const expensePayload = this.buildExpensePayload(dto);
            try {
                const expenseResult = await this.siigoService.createExpense(expensePayload);
                this.logger.log(`Egreso creado para empleado ${dto.employeeId}: ${expenseResult.id}`);
            }
            catch (error) {
                this.logger.error(`Error al crear egreso para ${dto.employeeId}: ${error.message}`);
            }
        }
    }
    buildVoucherPayload(dto) {
        return {
            date: new Date().toISOString().split("T")[0],
            description: `Pago nómina a ${dto.employeeName}`,
            lines: [
                {
                    account: "5125",
                    debit: 0,
                    credit: dto.netSalary,
                },
                {
                    account: "5105",
                    debit: dto.netSalary,
                    credit: 0,
                },
            ],
        };
    }
    buildExpensePayload(dto) {
        return {
            date: new Date().toISOString().split("T")[0],
            account: "1105",
            amount: dto.netSalary,
            description: `Egreso nómina a ${dto.employeeName}`,
        };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = PayrollService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [excel_service_1.ExcelService,
        siigo_service_1.SiigoService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map