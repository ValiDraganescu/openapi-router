/**
 Copyright 2020 Valentin Draganescu

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import {IPathParams, Request, Response} from "./event";
import {Validator} from "../validator/validator";
import {RouteMetadata} from "../metadata/router-metadata";
import {getMetadataStorage} from "../metadata/metadata-storage";
import {generateDoc} from "../doc/generator";

class Router {

  handleEvent = async (request: Request): Promise<Response> => {
    const [route, pathParams] = this.resolveHandler(request.method, request.path);
    if (route) {
      request.pathParams = pathParams;
      // validate request;
      if (route.requestBody) {
        const inputValidationErrors = Validator.validate(request.body, route.requestBody);
        if (inputValidationErrors && inputValidationErrors.length) {
          return new Response(400).setBody({errors: inputValidationErrors});
        }
      }

      const result = await route.handler(request);
      // validate response
      if (route.responses[0].body) {
        const outputValidationResult = Validator.validate(result.body, route.responses[0].body);
        if (outputValidationResult && outputValidationResult.length) {
          // the API broke the contract with the client, fail the request
          return new Response(500);
        }
      }

      return result;
    }
    return new Response(404);
  };

  getApiDoc = (version: string): any => {
    return generateDoc(version);
  };

  private removeTrailingSlash = (requestPath: string): string => {
    if (requestPath.endsWith("/")) {
      requestPath = requestPath.substr(0, requestPath.length - 1);
    }
    return requestPath;
  };

  private resolveHandler = (method: string, path: string): [RouteMetadata | null, IPathParams | null] => {
    const requestPath = this.removeTrailingSlash(path);
    let pathParams: IPathParams | null = null;
    const metadata = getMetadataStorage();
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
      for (let routeKey of routeKeys) {
        const routeComponents = routeKey.split("/");

        if (routeComponents.length === basePathComponents.length) {

          let isValidRoute = true;
          for (let i = 0; i < routeComponents.length; i++) {

            const routeComponent = routeComponents[i];
            const basePathComponent = basePathComponents[i];

            if (basePathComponent !== routeComponent) {
              if (routeComponent.startsWith("{")) {

                const paramName = routeComponent.slice(1, routeComponent.length -1);
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
            const methodMeta = metadata.paths.get(routeKey);
            if (methodMeta) {
              routeMeta = methodMeta[method];
              break;
            }

          }
        }
      }
    }

    return [routeMeta ?? null, pathParams];
  };
}

let router: Router;
export const getRouter = (): Router => {
  if (!router) {
    router = new Router();
  }
  return router;
};
