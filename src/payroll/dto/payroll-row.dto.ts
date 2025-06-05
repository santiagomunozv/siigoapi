import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Ejemplo de DTO para cada fila de la plantilla de nómina.
 * Ajusta los campos según cómo venga tu Excel.
 */
export class PayrollRowDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  employeeName: string;

  @IsNumber()
  @IsNotEmpty()
  netSalary: number;

  @IsString()
  @IsOptional()
  costCenter?: string;

  // Agrega aquí más propiedades según tu plantilla real
}
