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

import { getMetadataStorage } from "../../metadata/metadata-storage";
import { ObjectType } from "../../object-type";
import { HttpMethod } from "../..";
import { DocParameter } from "../../doc/model/parameter";
import { ResponseMetadata } from "../../metadata/response-metadata";
import { RouteMetadata } from "../../metadata/route-metadata";
import { MethodMetadata } from "../../metadata/method-metadata";
import { Logger } from "../../logger";
import { AfterMiddlewareHandler, BeforeMiddlewareHandler } from "../request-handler";

export interface IMiddleware {
  before?: BeforeMiddlewareHandler[];
  after?: AfterMiddlewareHandler[];
}

export interface IRouteProps {
  method: HttpMethod;
  path: string;
  description: string;
  responses: ResponseMetadata[];
  requestBody?: ObjectType<any>;
  summary?: string;
  parameters?: DocParameter[];
  security?: any[];
  middleware?: IMiddleware;
  tags?: string[];
}

export const Route = (props: IRouteProps) => {
  return (target: any, propertyKey: string) => {
    Logger.log("Adding route target::", target.constructor.name);
    Logger.log("Adding route prop key::", propertyKey);

    const metadata = getMetadataStorage();
    const routeMeta = new RouteMetadata(target[propertyKey])
      .setResponses(props.responses)
      .setRequestBody(props.requestBody);

    routeMeta.description = props.description;
    routeMeta.summary = props.summary;
    routeMeta.path = props.path;
    routeMeta.parameters = props.parameters;
    routeMeta.security = props.security;
    routeMeta.middleware = props.middleware;
    routeMeta.tags = props.tags;

    let methodMetadata;

    if (metadata.paths.has(props.path)) {
      methodMetadata = metadata.paths.get(props.path);
    } else {
      methodMetadata = new MethodMetadata();
    }
    if (methodMetadata) {
      methodMetadata[props.method] = routeMeta;
      metadata.paths.set(props.path, methodMetadata);
    }
  };
};
