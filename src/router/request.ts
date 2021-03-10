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
import { IPathParams } from "./path-params";
import { IQueryParams } from "./query-param";
import { IRequestOpts } from "./request-opts";
import { Logger } from "../logger";

export class Request<RequestBody = any> {
  headers?: { [key: string]: string };
  path: string;
  method: HttpMethod;
  body?: RequestBody;
  rawBody?: string | null;
  pathParams?: IPathParams | null;
  queryParams?: IQueryParams | null;
  extra: { [key: string]: any };

  constructor(opts: IRequestOpts<RequestBody>) {
    this.headers = opts.headers;
    this.path = opts.path;
    this.method = opts.method;
    this.body = opts.body;
    this.queryParams = opts.queryParams ?? this.getQueryParams();
    this.rawBody = opts.rawBody;
    this.extra = {};
  }

  private getQueryParams(): IQueryParams | null {
    Logger.log("Getting query params from", this.path);
    const paramPath = this.path.split("?")[1];
    if (paramPath) {
      Logger.log("Got param path::", paramPath);
      const params: IQueryParams = {};
      const paramPairs = paramPath.split("&");
      Logger.log(`There are ${paramPairs.length} params`);
      for (const paramPair of paramPairs) {
        const paramPairComponents = paramPair.split("=");
        params[paramPairComponents[0]] = paramPairComponents[1];
      }
      Logger.log("Got query params::", params);
      return params;
    }
    return null;
  }
}
