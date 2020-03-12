/**
 * Copyright 2020 Valentin Draganescu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { HttpMethod } from "..";
import { IPathParams } from "./path-params.interface";
import { IQueryParams } from "./query-param.interface";
import { IRequestOpts } from "./request-opts.interface";

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
      for (const paramPair of paramPairs) {
        const paramPairComponents = paramPair.split("=");
        params[paramPairComponents[0]] = paramPairComponents[1];
      }
      return params;
    }
    return null;
  }
}
