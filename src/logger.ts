
export class Logger {
  static log(arg: any, ...args:any[]) {
    if (process.env.ROUTER_LOGS || true) {
      console.log(arg, args);
    }
  }
}
