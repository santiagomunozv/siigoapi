"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_module_1 = require("./config/config.module");
const siigo_module_1 = require("./siigo/siigo.module");
const excel_module_1 = require("./excel/excel.module");
const payroll_module_1 = require("./payroll/payroll.module");
const provisions_module_1 = require("./provisions/provisions.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            siigo_module_1.SiigoModule,
            excel_module_1.ExcelModule,
            payroll_module_1.PayrollModule,
            provisions_module_1.ProvisionsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map