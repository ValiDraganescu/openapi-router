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

import { APIGatewayEvent, APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase } from "aws-lambda";
import { Envelope, getRouter, HttpMethod, Request, Response, StatusCode } from "..";

export abstract class LambdaRouter {
  router = async (event: APIGatewayEvent): Promise<Response<any>> => {
    let parsedBody: any;
    if (event.body) {
      try {
        parsedBody = JSON.parse(event.body);
      } catch (e) {
        return new Response<Envelope>(StatusCode.badRequest).setBody({ errors: [{ message: e.message }] });
      }
    }

    const request = this.getRequestFromEvent(event, parsedBody);
    try {
      return await getRouter().handleEvent(request);
    } catch (e) {
      return new Response<Envelope>(StatusCode.internalServerError).setBody({ errors: [{ message: e.message }] });
    }
  };

  getRequestFromEvent = (
    event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>,
    parsedBody: any,
  ): Request => {
    return new Request({
      headers: event.headers,
      path: event.path,
      method: event.httpMethod as HttpMethod,
      body: parsedBody,
      rawBody: event.body,
      queryParams: event.queryStringParameters,
    });
  };

  consumeEvent = async (event: Request): Promise<Response<any>> => {
    return getRouter().handleEvent(event);
  };
}
