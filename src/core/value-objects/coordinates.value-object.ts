import { IsNumber } from 'class-validator';

export class Coords {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  constructor(data: Partial<Coords>) {
    Object.assign(this, data);
  }

  toPoint() {
    return `POINT(${this.latitude} ${this.longitude})`;
  }
}
