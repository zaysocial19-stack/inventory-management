import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all customer orders' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
    description: 'Filter orders by status',
  })
  @ApiResponse({ status: 200, description: 'List of orders returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single order receipt details' })
  @ApiResponse({ status: 200, description: 'Order details returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Place a customer order (atomic: checks stock, deducts inventory, creates order items)',
  })
  @ApiResponse({ status: 201, description: 'Order placed successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient stock or validation failure' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update order status (ADMIN or MANAGER only)' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
