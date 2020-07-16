export class Printer {
  public _value: string

  public constructor (value: string) {
    this._value = value
  }

  public getValue (): string {
    return this._value
  }

  public print (): string {
    return this._value
  }

  public setValue (value: string): this {
    this._value = value
    return this
  }
}
