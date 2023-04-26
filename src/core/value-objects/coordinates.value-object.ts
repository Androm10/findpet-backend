export class Coords {
  latitude: number;
  longitude: number;

  toPoint() {
    return `POINT(${this.latitude}, ${this.longitude})`;
  }
}
