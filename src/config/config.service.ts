import { Injectable } from "@nestjs/common";
import * as Joi from "joi";

@Injectable()
export class ConfigService {
  private readonly env: { [key: string]: any };

  constructor() {
    const schema = Joi.object({
      SIIGO_USERNAME: Joi.string().required(),
      SIIGO_ACCESS_KEY: Joi.string().required(),
      SIIGO_API_BASE_URL: Joi.string().uri().required(),
    });

    const { error, value } = schema.validate(process.env, {
      allowUnknown: true,
      abortEarly: false,
    });
    if (error) {
      throw new Error(
        `Validación de variables de entorno fallida: ${error.message}`
      );
    }
    this.env = value;
  }

  get siigoUserName(): string {
    return this.env.SIIGO_USERNAME;
  }
  get siigoAccessKey(): string {
    return this.env.SIIGO_ACCESS_KEY;
  }
  get siigoApiBaseUrl(): string {
    return this.env.SIIGO_API_BASE_URL;
  }
}
