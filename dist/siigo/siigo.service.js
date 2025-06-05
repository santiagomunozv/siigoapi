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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiigoService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_service_1 = require("../config/config.service");
const rxjs_1 = require("rxjs");
let SiigoService = class SiigoService {
    constructor(http, configService) {
        this.http = http;
        this.configService = configService;
        this.token = null;
        this.tokenExpiresAt = 0;
    }
    async getAuthToken() {
        const ahora = Date.now();
        if (this.token && ahora < this.tokenExpiresAt) {
            return this.token;
        }
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post("/auth", {
                username: this.configService.siigoUserName,
                access_key: this.configService.siigoAccessKey,
            }, { headers: { "Content-Type": "application/json" } }));
            const { access_token, expires_in } = data;
            this.token = access_token;
            this.tokenExpiresAt = ahora + expires_in * 1000 - 10 * 1000;
            return this.token;
        }
        catch (e) {
            throw new common_1.BadRequestException(`Error al obtener token de Siigo: ${e.message}`);
        }
    }
    async createVoucher(payload) {
        const token = await this.getAuthToken();
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post("/comprobantes", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }));
            return data;
        }
        catch (e) {
            throw new common_1.BadRequestException(`Error al crear comprobante: ${e.message}`);
        }
    }
    async createExpense(payload) {
        const token = await this.getAuthToken();
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post("/egresos", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }));
            return data;
        }
        catch (e) {
            throw new common_1.BadRequestException(`Error al crear egreso: ${e.message}`);
        }
    }
};
exports.SiigoService = SiigoService;
exports.SiigoService = SiigoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_service_1.ConfigService])
], SiigoService);
//# sourceMappingURL=siigo.service.js.map