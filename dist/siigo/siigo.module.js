"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiigoModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_module_1 = require("../config/config.module");
const config_service_1 = require("../config/config.service");
const siigo_service_1 = require("./siigo.service");
let SiigoModule = class SiigoModule {
};
exports.SiigoModule = SiigoModule;
exports.SiigoModule = SiigoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            axios_1.HttpModule.registerAsync({
                imports: [config_module_1.ConfigModule],
                inject: [config_service_1.ConfigService],
                useFactory: (config) => ({
                    baseURL: config.siigoApiBaseUrl,
                    timeout: 5000,
                }),
            }),
        ],
        providers: [siigo_service_1.SiigoService],
        exports: [siigo_service_1.SiigoService],
    })
], SiigoModule);
//# sourceMappingURL=siigo.module.js.map