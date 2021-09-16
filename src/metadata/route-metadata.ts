import { ObjectType } from "../object-type";
import { DocParameter } from "../doc/model/parameter";
import { ResponseMetadata } from "./response-metadata";
import { IMiddleware } from "../router/decorators/route";
import { RequestHandler } from "..";
import { Logger } from "../logger";

export class RouteMetadata {
  handler: RequestHandler;
  responses: ResponseMetadata[] = [];
  path: string;
  description?: string;
  summary?: string;
  requestBody?: ObjectType<any>;
  example?: Record<string, unknown>;
  parameters?: DocParameter[];
  security?: any[];
  middleware?: IMiddleware;
  tags?: string[];

  constructor(handler: RequestHandler) {
    this.handler = handler;
  }

  setRequestBody = (requestBody?: ObjectType<any>): RouteMetadata => {
    if (requestBody) {
      this.requestBody = requestBody;
    }
    return this;
  };

  setResponses = (responses: ResponseMetadata[]): RouteMetadata => {
    Logger.log('setResponses', responses);
    this.responses = responses;
    return this;
  };
}
