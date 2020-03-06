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

export class Response<ResponseBody = any> {
  statusCode: StatusCode;
  body?: {
    data?: ResponseBody;
    errors?: ApiError[];
  };

  headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    "Cache-Control": "private, max-age=0, no-cache, no-store, must-revalidate'",
    "Expires": "-1",
    "Pragma": "no-cache",
    "Access-Control-Expose-Headers": "X-Api-Version",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  };

  constructor(statusCode?: StatusCode) {
    this.statusCode = statusCode ?? StatusCode.okay;
  }

  setData = (data: ResponseBody): Response => {
    if (!this.body) {
      this.body = {};
    }
    this.body.data = data;
    return this;
  };

  setErrors = (errors: ApiError[]): Response => {
    if (!this.body) {
      this.body = {};
    }
    this.body.errors = errors;
    return this;
  };

  addHeader = (key: string, value: string) => {
    this.headers[key] = value;
  };

  addHeaders = (headers: { [key: string]: string }) => {
    for (const [key, value] of Object.entries(headers)) {
      this.addHeader(key, value);
    }
  };

  setHeaders = (headers: { [key: string]: string }) => {
    this.headers = headers;
  };

  toJSON() {
    const { statusCode, headers, body } = this;
    return { statusCode, headers, body: JSON.stringify(body) };
  }
}
