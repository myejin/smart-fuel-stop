export class StationBrand {
  private code: number; // TODO

  public getCode(): number {
    return this.code;
  }

  public setByOpinet(pollDivCd: string): void {
    switch (pollDivCd) {
      case 'SKE':
        this.code = 1;
        break;

      default:
        break;
    }
  }
}
