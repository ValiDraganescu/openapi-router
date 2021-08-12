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
import { StatusCode } from "./status-code";
import { ApiError } from "./api-error";
import { Logger } from "../logger";

export class Response<ResponseBody> {
  statusCode: StatusCode;

  errors?: ApiError[];
  body?: any;
  headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    "Cache-Control": "private, max-age=0, no-cache, no-store, must-revalidate'",
    Expires: "-1",
    Pragma: "no-cache",
    "Access-Control-Expose-Headers": "X-Api-Version",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };

  constructor(statusCode?: StatusCode) {
    this.statusCode = statusCode ?? StatusCode.okay;
  }

  setBody = (body: ResponseBody): Response<ResponseBody> => {
    if (typeof body === "object") {
      if (body instanceof Buffer) {
        this.body = body;
      } else {
        this.body = JSON.stringify(body);
      }
    } else {
      this.body = body;
    }
    return this;
  };

  getBody = (): ResponseBody | string | Buffer => {
    if (this.body) {
      // this is such a bad thing to do
      try {
        return JSON.parse(this.body) as ResponseBody;
      } catch (err) {
        Logger.log("Body is not an object, returning null (use .getRawBody instead)");
      }
    }
    return this.body;
  };

  addHeader = (key: string, value: string): Response<ResponseBody> => {
    this.headers[key] = value;
    return this;
  };

  addHeaders = (headers: { [key: string]: string }): Response<ResponseBody> => {
    for (const [key, value] of Object.entries(headers)) {
      this.addHeader(key, value);
    }
    return this;
  };

  setHeader = (key: string, value: string): Response<ResponseBody> => {
    this.headers[key] = value;
    return this;
  };

  setHeaders = (headers: { [key: string]: string }): Response<ResponseBody> => {
    this.headers = headers;
    return this;
  };

  toJSON() {
    const { statusCode, headers, body } = this;
    return { statusCode, headers, body };
  }
}
