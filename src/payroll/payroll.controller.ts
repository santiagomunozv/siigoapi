import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PayrollService } from "./payroll.service";
import * as path from "path";
import * as fs from "fs";
import { diskStorage } from "multer"; // opcional, si quieres configurar almacenamiento

@Controller("payroll")
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  /**
   * Endpoint para subir un archivo Excel de nómina y procesarlo.
   * Usa multer internamente para recibir el archivo.
   */
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        // Opcional: configura carpeta y nombre de archivo
        destination: "./tmp",
        filename: (_req, file, callback) => {
          callback(null, file.originalname);
        },
      }),
    })
  )
  async uploadPayrollFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No se recibió ningún archivo.");
    }

    // 1) Guardar temporalmente el archivo en disco (p. ej., en /tmp)
    const tempPath = path.join(process.cwd(), "tmp", file.originalname);
    fs.mkdirSync(path.dirname(tempPath), { recursive: true });
    fs.writeFileSync(tempPath, file.buffer);

    // 2) Llamar a PayrollService para procesarlo
    await this.payrollService.processPayrollTemplate(tempPath, "Hoja1");

    // 3) Opcional: borrar el archivo temporal
    fs.unlinkSync(tempPath);

    return {
      message:
        "Procesamiento de nómina en curso. Revisa los logs para errores.",
    };
  }
}
