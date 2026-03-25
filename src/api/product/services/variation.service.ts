import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductVariation } from 'src/database/entities/productVariation.entity';
import { Product } from 'src/database/entities/product.entity';
import { CreateVariationDto } from '../dto/variation.dto';
import { errorMessages } from 'src/errors/custom';
import { VariationCreatedEvent } from 'src/common/events/product-variation-created.event';

@Injectable()
export class VariationService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(productId: number, data: CreateVariationDto) {
    const product = await this.entityManager.findOne(Product, {
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(errorMessages.product.notFound);
    }

    const variation = await this.entityManager.save(
      this.entityManager.create(ProductVariation, {
        ...data,
        productId,
      }),
    );

    this.eventEmitter.emit(
      'product.variation.created',
      new VariationCreatedEvent(
        variation.id,
        productId,
        variation.sizeCode,
        variation.colorName,
      ),
    );

    return variation;
  }
}
