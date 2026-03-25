import { Body, Controller, Param, Post, ParseIntPipe } from '@nestjs/common';
import { VariationService } from '../services/variation.service';
import { CreateVariationDto } from '../dto/variation.dto';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { RoleIds } from 'src/api/role/enum/role.enum';

@Controller('product/:productId/variation')
export class VariationController {
  constructor(private readonly variationService: VariationService) {}

  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @Post()
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: CreateVariationDto,
  ) {
    return this.variationService.create(productId, body);
  }
}
