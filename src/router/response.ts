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

export class Response<ResponseBody = any> {
  statusCode: number;
  body?: string;
  headers: { [key: string]: string } = {
    "Content-Type": "application/json"
  };

  constructor(statusCode?: number) {
    this.statusCode = statusCode ?? 200;
  }

  setBody = (body: ResponseBody): Response<ResponseBody> => {
    this.body = JSON.stringify(body);
    return this;
  };

  getBody = (): any => {
    if (this.body) {
      return JSON.parse(this.body);
    }
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
    return { statusCode, headers, body };
  }
}
