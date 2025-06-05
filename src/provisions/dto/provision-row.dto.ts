import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Ejemplo de DTO para cada fila de la plantilla de provisiones.
 * Ajusta los campos conforme venga tu Excel.
 */
export class ProvisionRowDto {
  @IsString()
  @IsNotEmpty()
  accountCode: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  // Agrega aquí más propiedades según tu plantilla real
}
