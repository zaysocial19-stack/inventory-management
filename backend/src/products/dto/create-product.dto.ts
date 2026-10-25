import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'COF-SUM-003', description: 'Unique Stock Keeping Unit' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Sumatra Mandheling (1kg)', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Dark roast with earthy, chocolate notes', description: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 32.5, description: 'Selling price per unit' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 'uuid-of-category', description: 'Valid Category UUID' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ example: 'uuid-of-supplier', description: 'Valid Supplier UUID' })
  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional({ example: 15, default: 0, description: 'Initial physical stock count' })
  @IsInt()
  @Min(0)
  @IsOptional()
  initialStock?: number;

  @ApiPropertyOptional({ example: 5, default: 5, description: 'Low stock warning threshold' })
  @IsInt()
  @Min(0)
  @IsOptional()
  minStockThreshold?: number;
}
