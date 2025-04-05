export abstract class BaseController<T> {
  public service: T

  constructor(service: new () => T) {
    this.service = new service()
  }
}
