import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Inventory } from 'src/database/entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async initializeStock(
    variationId: number,
    countryCode: string,
    quantity: number,
  ) {
    const inventory = this.entityManager.create(Inventory, {
      productVariationId: variationId,
      countryCode: countryCode,
      quantity: quantity,
    });

    return await this.entityManager.save(inventory);
  }

  async getStockByVariation(variationId: number) {
    return this.entityManager.findOne(Inventory, {
      where: { productVariationId: variationId },
    });
  }

  async getTotalStockByProduct(productId: number) {
    const result = await this.entityManager
      .createQueryBuilder(Inventory, 'inventory')
      .innerJoin('inventory.productVariation', 'variation')
      .where('variation.productId = :productId', { productId })
      .select('SUM(inventory.quantity)', 'total')
      .getRawOne();

    return parseInt(result.total) || 0;
  }

  async updateStock(inventoryId: number, quantity: number) {
    const result = await this.entityManager
      .createQueryBuilder()
      .update<Inventory>(Inventory)
      .set({ quantity })
      .where('id = :id', { id: inventoryId })
      .execute();

    return result.raw[0];
  }
}
