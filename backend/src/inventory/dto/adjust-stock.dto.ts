import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty({ example: 'uuid-of-product', description: 'Product UUID to adjust' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    enum: MovementType,
    example: MovementType.OUT,
    description: 'Type of movement: OUT (waste/damage), ADJUSTMENT (count audit), or RETURN (customer restock)',
  })
  @IsEnum(MovementType)
  @IsNotEmpty()
  type: MovementType;

  @ApiProperty({ example: 2, description: 'Quantity to change (must be positive)' })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    example: 'Spilled 2 cartons during morning rush; carton broke',
    description: 'Mandatory reason explaining this adjustment',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
