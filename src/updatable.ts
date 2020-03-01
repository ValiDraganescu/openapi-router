export abstract class Updatable {

  public update = <T>(opts?: Partial<T>) => {
    let self = this;
    if (opts) {
      Object.assign(self, opts);
    }
  };
}
