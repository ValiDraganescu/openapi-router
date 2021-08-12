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

import { Response } from "./response";
import { Request } from "./request";
import { Envelope } from "../response/envelope";

export type RequestHandler = (request: Request) => Promise<Response<Envelope | string | Buffer>>;
export type BeforeMiddlewareHandler = (request: Request) => Promise<[Request, Response<Envelope | string | Buffer> | null]>;
export type AfterMiddlewareHandler = (response: Response<Envelope | string | Buffer>) => Promise<Response<Envelope | string | Buffer>>;
