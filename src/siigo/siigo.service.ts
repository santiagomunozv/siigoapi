import { Injectable, BadRequestException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "../config/config.service";
import { firstValueFrom } from "rxjs";

interface AuthResponse {
  access_token: string;
  expires_in: number;
}

@Injectable()
export class SiigoService {
  private token: string | null = null;
  private tokenExpiresAt: number = 0; // timestamp en ms

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Obtener o reutilizar el token de Siigo.
   */
  async getAuthToken(): Promise<string> {
    const ahora = Date.now();

    if (this.token && ahora < this.tokenExpiresAt) {
      return this.token;
    }

    try {
      const { data } = await firstValueFrom(
        this.http.post<AuthResponse>(
          "/auth",
          {
            username: this.configService.siigoUserName,
            access_key: this.configService.siigoAccessKey,
          },
          { headers: { "Content-Type": "application/json" } }
        )
      );

      const { access_token, expires_in } = data;
      this.token = access_token;
      this.tokenExpiresAt = ahora + expires_in * 1000 - 10 * 1000;
      return this.token;
    } catch (e: any) {
      throw new BadRequestException(
        `Error al obtener token de Siigo: ${e.message}`
      );
    }
  }

  /**
   * Crea un comprobante contable en Siigo.
   */
  async createVoucher(payload: any): Promise<any> {
    const token = await this.getAuthToken();

    try {
      const { data } = await firstValueFrom(
        this.http.post("/comprobantes", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      );
      return data;
    } catch (e: any) {
      throw new BadRequestException(`Error al crear comprobante: ${e.message}`);
    }
  }

  /**
   * Crea un egreso en Siigo.
   */
  async createExpense(payload: any): Promise<any> {
    const token = await this.getAuthToken();

    try {
      const { data } = await firstValueFrom(
        this.http.post("/egresos", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      );
      return data;
    } catch (e: any) {
      throw new BadRequestException(`Error al crear egreso: ${e.message}`);
    }
  }
}
