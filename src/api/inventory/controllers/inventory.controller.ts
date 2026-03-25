import { Body, Controller, Param, Patch } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { RoleIds } from 'src/api/role/enum/role.enum';
import { FindOneParams } from 'src/common/helper/findOneParams.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @Patch(':id/stock')
  async updateStock(
    @Param() inventory: FindOneParams,
    @Body() body: { quantity: number },
  ) {
    return this.inventoryService.updateStock(inventory.id, body.quantity);
  }
}
