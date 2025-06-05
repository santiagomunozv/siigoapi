import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProvisionsService } from "./provisions.service";
import * as path from "path";
import * as fs from "fs";
import { diskStorage } from "multer"; // opcional, si quieres configurar almacenamiento

@Controller("provisions")
export class ProvisionsController {
  constructor(private readonly provisionsService: ProvisionsService) {}

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
  async uploadProvisionsFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No se recibió ningún archivo.");
    }

    const tempPath = path.join(process.cwd(), "tmp", file.originalname);
    fs.mkdirSync(path.dirname(tempPath), { recursive: true });
    fs.writeFileSync(tempPath, file.buffer);

    await this.provisionsService.processProvisionsTemplate(tempPath, "Hoja1");
    fs.unlinkSync(tempPath);

    return {
      message:
        "Procesamiento de provisiones en curso. Revisa los logs para errores.",
    };
  }
}
