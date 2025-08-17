import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Position } from 'src/vo/position.vo';

export enum OpinetSortBy {
  Distance = 0,
  Price = 1,
}

export enum OpinetFuelType {
  Default = 'B027',
}

export interface OpinetStation {
  UNI_ID: string; // 주유소코드
  POLL_DIV_CD: string; // 상표 (SKE: SK에너지)
  OS_NM: string; // 상호
  PRICE: number; // 가격
  DISTANCE: number; // 기준 위치로부터 거리 (m)
  GIS_X_COOR: number; // KATEC X 좌표
  GIS_Y_COOR: number; // KATEC Y 좌표
}

@Injectable()
export class OpinetService {
  // ref: https://www.opinet.co.kr/user/custapi/custApiInfo.do#

  async getNearbyStations(
    position: Position,
    prodcd: OpinetFuelType,
    sortBy: OpinetSortBy,
    limit: number,
    radiusM: number,
  ): Promise<OpinetStation[]> {
    const { x, y } = position.getXY();

    const res = await this.get<{ OIL: OpinetStation[] }>(`/aroundAll.do`, {
      x,
      y,
      radius: radiusM,
      prodcd,
      sortBy,
    });

    if (!res.success) {
      return [];
    }
    return res.data.OIL.slice(0, limit);
  }

  private async get<T>(
    path: string,
    searchParams: Record<string, string | number> = {},
  ): Promise<{
    success: boolean;
    data: T;
    error?: string;
  }> {
    try {
      const paramStr = Object.entries({
        ...searchParams,
        code: '-', // TODO: env
        out: 'json',
      })
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const { data } = await axios.get<{ RESULT: T }>(
        `http://www.opinet.co.kr/api${path}?${paramStr}`,
      );

      return {
        success: true,
        data: data.RESULT,
      };
    } catch (e) {
      const errorMessage = `❌ [opinet] path: ${path} / res: ${JSON.stringify(e)}`;
      console.error(errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: {} as T,
      };
    }
  }
}
