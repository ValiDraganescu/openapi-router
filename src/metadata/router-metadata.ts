
import {ObjectType} from "../object-type";
import {PropertyType} from "../doc/property-type";
import {DocInfo} from "../doc/model/info";
import {DocParameter} from "../doc/model/parameter";
import {Request, Response} from "../router/event";

type RequestHandler = (request: Request) => Promise<Response>;

export class PropertyMetadata {
  type: PropertyType;
  nullable?: boolean;
  objectType?: ObjectType<any>;
  minSize?: number;
  maxSize?: number;
  isRequired?: boolean;
  description?: string;
  format?: string;
}

export class ResponseMetadata {
  statusCode: number;
  description: string;
  body?: ObjectType<any>;
}

export class ModelMetadata {
  [key: string]: PropertyMetadata;
}

export class RouteMetadata {
  handler: RequestHandler;
  responses: ResponseMetadata[] = [];
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

export class MethodMetadata {
  [key: string]: RouteMetadata;
}

export class RouterMetadata {
  paths: Map<string, MethodMetadata> = new Map<string, MethodMetadata>();
  entities: { [key: string]: ModelMetadata } = {};
  docMetadata?: DocInfo;

  getPaths = (): string[] => {
    return Array.from(this.paths.keys());
  };
}
