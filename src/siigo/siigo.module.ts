import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { SiigoService } from "./siigo.service";

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: config.siigoApiBaseUrl,
        timeout: 5000,
      }),
    }),
  ],
  providers: [SiigoService],
  exports: [SiigoService],
})
export class SiigoModule {}
