import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from 'src/database/entities/inventory.entity';
import { InventoryService } from './services/inventory.service';
import { ProductVariationListener } from './listeners/product-variation.listener';
import { ProductActivationListener } from './listeners/product-active.listener';
import { Product } from 'src/database/entities/product.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { InventoryController } from './controllers/inventory.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Product]), UserModule],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    ProductVariationListener,
    ProductActivationListener,
    NotificationsGateway,
  ],
})
export class InventoryModule {}
