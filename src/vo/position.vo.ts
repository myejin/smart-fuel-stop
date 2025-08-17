import proj4 from 'proj4';

export type LatLng = { lat: number; lng: number };
export type XY = { x: number; y: number };

export class Position {
  private latLng: LatLng;

  private static readonly wgs84 = 'EPSG:4326';
  private static readonly projections: Record<string, string> = {
    KATEC:
      '+proj=tmerc +lat_0=38 +lon_0=128 +k=0.9999 ' +
      '+x_0=400000 +y_0=600000 +ellps=GRS80 +units=m +no_defs',
    EPSG5179:
      '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 ' +
      '+x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs',
    EPSG3857: 'EPSG:3857',
  };

  constructor(latLng?: LatLng) {
    if (latLng) {
      this.latLng = { lat: latLng.lat, lng: latLng.lng };
    }
  }

  public setByXY(
    x: number,
    y: number,
    from: keyof typeof Position.projections = 'KATEC',
  ): void {
    this.latLng = this.toLatLng({ x, y }, from);
  }

  public getLatLng(): LatLng {
    return this.latLng;
  }

  public getXY(projection = 'KATEC'): XY {
    return this.fromLatLng(projection);
  }

  private toLatLng(
    { x, y }: XY,
    from: keyof typeof Position.projections,
  ): LatLng {
    const src = Position.projections[from];
    const [lng, lat] = proj4(src, Position.wgs84, [x, y]);

    return { lat, lng };
  }

  private fromLatLng(to: keyof typeof Position.projections = 'KATEC'): XY {
    const { lat, lng } = this.latLng;
    const [x, y] = proj4(Position.wgs84, Position.projections[to], [lng, lat]);

    return { x, y };
  }
}
