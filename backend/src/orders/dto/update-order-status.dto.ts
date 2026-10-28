import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.COMPLETED,
    description: 'Order status: PENDING, COMPLETED, or CANCELLED',
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
