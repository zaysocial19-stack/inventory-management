import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 'uuid-of-product', description: 'Product UUID being purchased' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'Number of units purchased (min 1)' })
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [OrderItemDto],
    description: 'List of order line items',
    example: [{ productId: 'uuid-of-product', quantity: 2 }],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'An order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
