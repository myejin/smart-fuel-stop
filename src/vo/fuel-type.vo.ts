import { OpinetFuelType } from '../fuel-station/opinet.service';

export class FuelType {
  private readonly value: number; // TODO

  constructor(value: number) {
    this.validate(value);
    this.value = value;
  }

  public toOpinetType(): OpinetFuelType {
    switch (this.value) {
      default:
        return OpinetFuelType.Default;
    }
  }

  public getValue(): number {
    return this.value;
  }

  private validate(value: number): void {
    if (value <= 0) {
      throw new Error('Fuel type value must be a positive number');
    }
  }
}
