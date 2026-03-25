import { Injectable } from '@nestjs/common';
import { ProductActivatedEvent } from 'src/common/events/product-activated.event';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { InventoryService } from '../services/inventory.service';
import { Product } from 'src/database/entities/product.entity';
import { NotificationsGateway } from 'src/api/notifications/notifications.gateway';

@Injectable()
export class ProductActivationListener {
  constructor(
    private readonly inventoryService: InventoryService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @OnEvent('product.activated', { async: true })
  async handleProductActivated(event: ProductActivatedEvent) {
    console.log(
      `[Validation] Validando stock para activación del producto ${event.productId}...`,
    );

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 1. Consultar stock total de todas las variaciones
    const totalStock = await this.inventoryService.getTotalStockByProduct(
      event.productId,
    );

    if (totalStock <= 0) {
      console.warn(
        `[Validation] ¡ALERTA! Producto ${event.productId} no tiene stock. Revirtiendo activación.`,
      );
      await this.entityManager
        .createQueryBuilder()
        .update(Product)
        .set({ isActive: false })
        .where('id = :id', { id: event.productId })
        .execute();

      this.notificationsGateway.sendNotification(
        'admin',
        `Activación fallida: El producto ${event.productId} no tiene stock disponible. Se ha revertido la activación.`,
      );
    } else {
      console.log(
        `[Validation] Producto ${event.productId} validado con éxito.`,
      );
    }
  }
}
