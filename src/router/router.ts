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
import { IPathParams } from "./path-params";
import { Logger } from "../logger";
import { IMiddleware } from "./decorators/route";
import { AfterMiddlewareHandler, BeforeMiddlewareHandler, Envelope, Request, Response, StatusCode } from "..";
import { Validator } from "../validator/validator";
import { ResponseMetadata } from "../metadata/response-metadata";
import { IPathParam } from "./path-param";
import { PropertyMetadata } from "../metadata/property-metadata";
import { getDefaultRandomInteger, getDefaultRandomString, getRandomBoolean } from "./mock/get-random";

const isPrimitive = (type: any): boolean => {
  if (typeof type === "string") {
    return ["string", "number", "integer", "boolean"].includes(type);
  }
  return false;
};

export class Router {
  private getRandomValue(keyMetadata: PropertyMetadata) {
    switch (keyMetadata.type) {
      case "string": {
        return getDefaultRandomString();
      }
      case "boolean": {
        return getRandomBoolean();
      }
      default: {
        return getDefaultRandomInteger();
      }
    }
  }

  mockResponse(request: Request, statusCode: StatusCode) {
    const [route] = this.resolveHandler(request.method, request.path);
    if (!route) {
      throw new Error(`The route ${request.method}:${request.path} is not defined`);
    }

    const responseMeta: ResponseMetadata | undefined = route.responses.find(r => r.statusCode === statusCode);
    if (!responseMeta) {
      throw new Error(
        `The route ${request.method}:${request.path} does not define a response for status code ${statusCode}`,
      );
    }
    const metadata = getMetadataStorage();
    const body = responseMeta.body;
    const responseName = body!.name;
    const responseMetadata = metadata.entities[responseName];
    const data = responseMetadata.data;
    const resp = this.getMockData(data.objectType as string);
    return {
      data: resp,
    };
  }

  private getMockData(modelName: string) {
    const resp: any = {};
    const metadata = getMetadataStorage();
    const dataModel = metadata.entities[modelName];
    for (const key in dataModel) {
      if (dataModel.hasOwnProperty(key)) {
        const keyMetadata = dataModel[key];
        if (!isPrimitive(keyMetadata.type)) {
          resp[key] = this.getRandomValue(keyMetadata);
        }
        if (keyMetadata.type === "object") {
          const subModelName = keyMetadata.objectType as string;
          resp[key] = this.getMockData(subModelName);
        }
      }
    }
    return resp;
  }

  handleEvent = async (request: Request): Promise<Response<any>> => {
    Logger.time("[TIMING] Router");

    let resp: Response<any> | null = null;
    let req: Request | null = request;
    Logger.time("[TIMING] Router handler resolver");
    const [route, pathParams, middleware] = this.resolveHandler(req.method, req.path);
    Logger.timeEnd("[TIMING] Router handler resolver");
    if (route) {
      Logger.log("Route resolved to::", route.path);
      req.pathParams = pathParams;
      // validate request;
      if (route.requestBody) {
        Logger.time("[TIMING] Router validate request");
        Logger.log("Validating input");
        const inputValidationErrors = Validator.validate(req.body, route.requestBody.name);
        if (inputValidationErrors && inputValidationErrors.length) {
          Logger.timeEnd("[TIMING] Router");
          return new Response<Envelope>(StatusCode.badRequest).setBody({
            errors: inputValidationErrors,
          });
        }
        Logger.timeEnd("[TIMING] Router validate request");
      }
      if (request.queryParams) {
        for (const queryParam of Object.keys(request.queryParams)) {
          request.queryParams[queryParam] = decodeURIComponent(request.queryParams[queryParam]);
        }
      }

      Logger.time("[TIMING] Router middleware before");
      const globalMiddleware = getMetadataStorage().docMetadata?.globalMiddleware;

      if (globalMiddleware && globalMiddleware.before) {
        Logger.log("Executing global middleware before");
        [req, resp] = await this.executeMiddlewareBefore(globalMiddleware?.before, req);
        if (resp) {
          Logger.timeEnd("[TIMING] Router");
          return resp;
        }
      }

      if (middleware && middleware.before) {
        Logger.log("Executing middleware before");
        [req, resp] = await this.executeMiddlewareBefore(middleware.before, req!);
        if (resp) {
          Logger.timeEnd("[TIMING] Router");
          return resp;
        }
      }
      Logger.timeEnd("[TIMING] Router middleware before");

      Logger.log("Executing handler");
      Logger.time("[TIMING] Router handler");
      resp = await route.handler(req!);
      Logger.timeEnd("[TIMING] Router handler");

      Logger.time("[TIMING] Router middleware after");
      if (middleware && middleware.after) {
        Logger.log("Executing middleware after");
        resp = await this.executeMiddlewareAfter(middleware.after, resp!);
      }

      if (globalMiddleware && globalMiddleware.after) {
        Logger.log("Executing global middleware after");
        resp = await this.executeMiddlewareAfter(globalMiddleware.after, resp!);
      }
      Logger.time("[TIMING] Router middleware after");

      // validate response
      Logger.time("[TIMING] Router validate response");
      Logger.log("Validating response");
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

      // if (responseMeta.body) {
      //   Logger.log("Validating output");
      //   const body = resp!.getBody();
      //
      //   const outputValidationResult = Validator.validate(body, responseMeta.body.name);
      //   Logger.timeEnd("[TIMING] Router validate response");
      //   if (outputValidationResult && outputValidationResult.length) {
      //     // the API broke the contract with the client, fail the request
      //     console.log(outputValidationResult);
      //     Logger.timeEnd("[TIMING] Router");
      //     return new Response<Envelope>(StatusCode.internalServerError).setBody({
      //       errors: outputValidationResult,
      //     });
      //   }
      // }

      Logger.timeEnd("[TIMING] Router");
      return resp!;
    } else {
      Logger.log("Route not resolved::", JSON.stringify(request));
    }
    Logger.timeEnd("[TIMING] Router");
    return new Response<Envelope>(StatusCode.notFound).setBody({
      errors: [
        {
          code: "not-found",
          message: "404 Not found",
        },
      ],
    });
  };

  getApiDoc = (version: string): any => {
    return generateDoc(version);
  };

  private executeMiddlewareBefore = async (
    before: BeforeMiddlewareHandler[],
    request: Request,
  ): Promise<[Request | null, Response<any> | null]> => {
    let response: Response<any> | null = null;
    for (const handler of before) {
      [request, response] = await handler(request);
      if (response) {
        return [null, response];
      }
    }
    return [request, null];
  };

  private executeMiddlewareAfter = async (
    after: AfterMiddlewareHandler[],
    response: Response<Envelope | string | Buffer>,
  ): Promise<Response<Envelope | string | Buffer>> => {
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
    path: string,
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
      const routeKeys = metadata.getPaths().sort((a, b) => {
        return a.split("{").length - b.split("{").length;
      });
      pathParams = {};
      Logger.log("Route keys::", JSON.stringify(routeKeys));
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
                  value: decodeURIComponent(basePathComponents[i]),
                  index: i,
                } as IPathParam;
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
