import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { InventoryService } from './inventory.service';
import { ReceiveStockDto } from './dto/receive-stock.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'List all inventory items with computed lowStock flag' })
  @ApiResponse({ status: 200, description: 'All inventory items returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.inventoryService.findAll();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'List only low-stock items requiring urgent reorders' })
  @ApiResponse({ status: 200, description: 'Low-stock items returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findLowStock() {
    return this.inventoryService.findLowStock();
  }

  @Get('movements')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get stock movement audit history (ADMIN and MANAGER only)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 50,
    description: 'Number of movement records to return',
  })
  @ApiResponse({ status: 200, description: 'Audit movements returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getMovements(@Query('limit') limit?: string) {
    const take = limit ? parseInt(limit, 10) : 50;
    return this.inventoryService.getMovements(take);
  }

  @Post('receive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive supplier shipment (increments stockQuantity & logs IN movement)',
  })
  @ApiResponse({ status: 200, description: 'Stock received and logged' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async receiveStock(@Request() req: any, @Body() dto: ReceiveStockDto) {
    return this.inventoryService.receiveStock(req.user.id, dto);
  }

  @Post('adjust')
  @Roles('ADMIN', 'MANAGER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Adjust stock for waste, shrinkage, or audit counts (ADMIN or MANAGER only)',
  })
  @ApiResponse({ status: 200, description: 'Stock adjusted and audit movement logged' })
  @ApiResponse({ status: 400, description: 'Insufficient stock or validation failure' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN or MANAGER' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async adjustStock(@Request() req: any, @Body() dto: AdjustStockDto) {
    return this.inventoryService.adjustStock(req.user.id, dto);
  }
}
