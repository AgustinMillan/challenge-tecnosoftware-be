export class VariationCreatedEvent {
  constructor(
    public readonly variationId: number,
    public readonly productId: number,
    public readonly sizeCode: string,
    public readonly colorName: string,
  ) {}
}
