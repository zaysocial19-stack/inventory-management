import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class ReceiveStockDto {
  @ApiProperty({ example: 'uuid-of-product', description: 'Product UUID receiving inventory' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 24, description: 'Number of units received (must be positive)' })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({ example: 'Weekly scheduled delivery from Artisan Roasters', description: 'Intake note' })
  @IsString()
  @IsOptional()
  reason?: string;
}
