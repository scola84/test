export class Printer {
  public _value: string

  public constructor (value: string) {
    this._value = value
  }

  public print (): string {
    return this._value
  }
}
