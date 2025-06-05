import { HttpService } from "@nestjs/axios";
import { ConfigService } from "../config/config.service";
export declare class SiigoService {
    private readonly http;
    private readonly configService;
    private token;
    private tokenExpiresAt;
    constructor(http: HttpService, configService: ConfigService);
    getAuthToken(): Promise<string>;
    createVoucher(payload: any): Promise<any>;
    createExpense(payload: any): Promise<any>;
}
