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
var ProvisionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisionsService = void 0;
const common_1 = require("@nestjs/common");
const excel_service_1 = require("../excel/excel.service");
const siigo_service_1 = require("../siigo/siigo.service");
const provision_row_dto_1 = require("./dto/provision-row.dto");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let ProvisionsService = ProvisionsService_1 = class ProvisionsService {
    constructor(excelService, siigoService) {
        this.excelService = excelService;
        this.siigoService = siigoService;
        this.logger = new common_1.Logger(ProvisionsService_1.name);
    }
    async processProvisionsTemplate(filePath, sheetName) {
        const rawRows = await this.excelService.readSheet(filePath, sheetName);
        for (const rawRow of rawRows) {
            const dto = (0, class_transformer_1.plainToClass)(provision_row_dto_1.ProvisionRowDto, rawRow);
            try {
                await (0, class_validator_1.validateOrReject)(dto);
            }
            catch (errors) {
                this.logger.error(`Fila inválida en provisiones: ${JSON.stringify(rawRow)} - Errores: ${errors}`);
                continue;
            }
            const voucherPayload = this.buildProvisionVoucherPayload(dto);
            try {
                const voucherResult = await this.siigoService.createVoucher(voucherPayload);
                this.logger.log(`Comprobante de provisión creado: ${voucherResult.id}`);
            }
            catch (error) {
                this.logger.error(`Error al crear comprobante de provisión (fila: ${JSON.stringify(dto)}): ${error.message}`);
            }
        }
    }
    buildProvisionVoucherPayload(dto) {
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
                    account: "2205",
                    debit: 0,
                    credit: dto.amount,
                },
            ],
        };
    }
};
exports.ProvisionsService = ProvisionsService;
exports.ProvisionsService = ProvisionsService = ProvisionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [excel_service_1.ExcelService,
        siigo_service_1.SiigoService])
], ProvisionsService);
//# sourceMappingURL=provisions.service.js.map