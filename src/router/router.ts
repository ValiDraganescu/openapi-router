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

import { getMetadataStorage } from "../metadata/metadata-storage";
import { generateDoc } from "../doc/generator";
import { RouteMetadata } from "../metadata/route-metadata";
import { IPathParams } from "./path-params.interface";
import { Logger } from "../logger";
import { IMiddleware } from "./decorators/route";
import { AfterMiddlewareHandler, BeforeMiddlewareHandler, Request, Response } from "..";
import { Validator } from "../validator/validator";
import { ResponseMetadata } from "../metadata/response-metadata";

class Router {
  handleEvent = async (request: Request): Promise<Response> => {
    let resp: Response | null = null;
    let req: Request | null = request;

    const [route, pathParams, middleware] = this.resolveHandler(req.method, req.path);
    if (route) {
      Logger.log("Route resolved to::", route.path);
      req.pathParams = pathParams;
      // validate request;
      if (route.requestBody) {
        const inputValidationErrors = Validator.validate(req.body, route.requestBody);
        if (inputValidationErrors && inputValidationErrors.length) {
          return new Response(400).setBody(inputValidationErrors);
        }
      }

      const globalMiddleware = getMetadataStorage().docMetadata?.globalMiddleware;

      if (globalMiddleware && globalMiddleware.before) {
        [req, resp] = await this.executeMiddlewareBefore(globalMiddleware?.before, req);
        if (resp) {
          return resp;
        }
      }

      if (middleware && middleware.before) {
        [req, resp] = await this.executeMiddlewareBefore(middleware.before, req!);
        if (resp) {
          return resp;
        }
      }

      resp = await route.handler(req!);

      if (middleware && middleware.after) {
        resp = await this.executeMiddlewareAfter(middleware.after, resp!);
      }

      if (globalMiddleware && globalMiddleware.after) {
        resp = await this.executeMiddlewareAfter(globalMiddleware.after, resp!);
      }

      // validate response
      let responseMeta: ResponseMetadata | undefined = route.responses.find(r => r.statusCode === resp!.statusCode);
      Logger.log("Route responses::", route.responses);
      if (!responseMeta) {
        const globalResponses = getMetadataStorage().docMetadata?.globalResponses;
        Logger.log("Global responses::", globalResponses);
        responseMeta = globalResponses?.find(r => r.statusCode === resp!.statusCode);
      }

      if (!responseMeta) {
        throw new Error(`No response defined for status code ${resp!.statusCode}`);
      }
      if (responseMeta.body) {
        const outputValidationResult = Validator.validate(resp!.getBody(), responseMeta.body);
        if (outputValidationResult && outputValidationResult.length) {
          // the API broke the contract with the client, fail the request
          console.log(outputValidationResult);
          return new Response(500).setBody(outputValidationResult);
        }
      }

      return resp!;
    } else {
      Logger.log("Route not resolved::", JSON.stringify(request));
    }
    return new Response(404);
  };

  getApiDoc = (version: string): any => {
    return generateDoc(version);
  };

  private executeMiddlewareBefore = async (before: BeforeMiddlewareHandler[], request: Request): Promise<[Request | null, Response | null]> => {
    let response: Response | null = null;
    for (const handler of before) {
      [request, response] = await handler(request);
      if (response) {
        return [null, response];
      }

    }
    return [request, null];
  };

  private executeMiddlewareAfter = async (after: AfterMiddlewareHandler[], response: Response): Promise<Response> => {
    for (const handler of after) {
      response = await handler(response);
    }
    return response;
  };

  private removeTrailingSlash = (requestPath: string): string => {
    if (requestPath.endsWith("/")) {
      requestPath = requestPath.substr(0, requestPath.length - 1);
    }
    return requestPath;
  };

  private resolveHandler = (
    method: string,
    path: string
  ): [RouteMetadata | null, IPathParams | null, IMiddleware | null] => {
    const requestPath = this.removeTrailingSlash(path);
    let pathParams: IPathParams | null = null;
    const metadata = getMetadataStorage();

    Logger.log("Router registered paths::", metadata.getPaths());

    let routeMeta: RouteMetadata | null = null;
    const methodMeta = metadata.paths.get(requestPath);
    if (methodMeta) {
      routeMeta = methodMeta[method];
    }

    if (!routeMeta) {
      const basePath = path.split("?")[0];
      const basePathComponents = basePath.split("/");
      const routeKeys = metadata.getPaths();
      pathParams = {};
      for (const routeKey of routeKeys) {
        const routeComponents = routeKey.split("/");

        if (routeComponents.length === basePathComponents.length) {
          let isValidRoute = true;
          for (let i = 0; i < routeComponents.length; i++) {
            const routeComponent = routeComponents[i];
            const basePathComponent = basePathComponents[i];

            if (basePathComponent !== routeComponent) {
              if (routeComponent.startsWith("{")) {
                const paramName = routeComponent.slice(1, routeComponent.length - 1);
                pathParams[paramName] = {
                  name: paramName,
                  value: basePathComponents[i],
                  index: i
                };
              } else {
                isValidRoute = false;
              }
            }
          }

          if (isValidRoute) {
            const validMethodMeta = metadata.paths.get(routeKey);
            if (validMethodMeta) {
              routeMeta = validMethodMeta[method];
              break;
            }
          }
        }
      }
    }

    return [routeMeta ?? null, pathParams ?? null, routeMeta?.middleware ?? null];
  };
}

let router: Router;
export const getRouter = (): Router => {
  if (!router) {
    router = new Router();
  }
  return router;
};
