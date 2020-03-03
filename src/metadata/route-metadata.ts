import { ObjectType } from "../object-type";
import { DocParameter } from "../doc/model/parameter";
import { RequestHandler } from "..";
import { ResponseMetadata } from "./response-metadata";

export class RouteMetadata {
  handler: RequestHandler;
  responses: ResponseMetadata[] = [];
  path: string;
  description?: string;
  summary?: string;
  requestBody?: ObjectType<any>;
  parameters?: DocParameter[];
  security?: any[];

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
    this.responses = responses;
    return this;
  };
}
