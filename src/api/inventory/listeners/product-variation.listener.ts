import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { VariationCreatedEvent } from 'src/common/events/product-variation-created.event';
import { InventoryService } from '../services/inventory.service';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class ProductVariationListener {
  constructor(private readonly inventoryService: InventoryService) {}

  @OnEvent('product.variation.created', { async: true })
  async handleVariationCreated(event: VariationCreatedEvent) {
    console.log(
      `[Inventory] Evento recibido para variación: ${event.variationId}`,
    );

    const DEFAULT_COUNTRY = 'EG';
    const INITIAL_STOCK = 0;

    try {
      await sleep(3000);

      await this.inventoryService.initializeStock(
        event.variationId,
        DEFAULT_COUNTRY,
        INITIAL_STOCK,
      );
      console.log(
        `[Inventory] Stock inicializado con éxito para la variación ${event.variationId}`,
      );
    } catch (error) {
      console.error(`[Inventory] Error al inicializar stock: ${error.message}`);
      //SEND TO RESTART QUEUE
    }
  }
}
