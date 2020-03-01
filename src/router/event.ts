import {HttpMethod} from "../doc/http-method";

export interface IPathParam {
  name: string;
  value: string | number;
  index: number;
}

export interface IPathParams {
  [key: string]: IPathParam
}

export interface IQueryParams {
  [key: string]: any
}

export interface IRequestOpts<RequestBody> {
  headers?: { [key: string]: string };
  path: string;
  method: HttpMethod;
  body?: RequestBody;
  pathParams?: IPathParams;
}

export class Request<RequestBody = any> {
  headers?: { [key: string]: string };
  path: string;
  method: HttpMethod;
  body?: RequestBody;
  pathParams?: IPathParams | null;
  queryParams?: IQueryParams | null;

  constructor(opts: IRequestOpts<RequestBody>) {
    this.headers = opts.headers;
    this.path = opts.path;
    this.method = opts.method;
    this.body = opts.body;
    this.queryParams = this.getQueryParams();
  }

  private getQueryParams(): IQueryParams | null {
    const paramPath = this.path.split("?")[1];
    if (paramPath) {
      const params: IQueryParams = {};
      const paramPairs = paramPath.split("&");
      for (let paramPair of paramPairs) {
        const paramPairComponents = paramPair.split("=");
        params[paramPairComponents[0]] = paramPairComponents[1];
      }
      return params;
    }
    return null;
  }
}

export class Response<ResponseBody = any> {
  statusCode: number;
  body?: ResponseBody;

  constructor(statusCode?: number) {
    this.statusCode = statusCode ?? 200;
  }

  setBody = (body: ResponseBody): Response<ResponseBody> => {
    this.body = body;
    return this;
  };
}
