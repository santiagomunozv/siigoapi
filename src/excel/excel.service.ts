import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

@Injectable()
export class ExcelService {
  /**
   * Lee un archivo Excel (.xlsx) y devuelve un array de objetos por cada fila de la hoja especificada.
   * @param filePath Ruta al archivo .xlsx
   * @param sheetName Nombre de la hoja a procesar
   */
  async readSheet(filePath: string, sheetName: string): Promise<any[]> {
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException(`El archivo ${filePath} no existe.`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new BadRequestException(`La hoja "${sheetName}" no existe en el archivo.`);
    }

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    return rows; // Cada elemento es un objeto: { columnaA: valor, columnaB: valor, ... }
  }
}
