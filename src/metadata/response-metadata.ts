import { ObjectType } from "../object-type";

export class ResponseMetadata {
  statusCode: number;
  description: string;
  contentType?: string;
  type?: "object" | "array";
  body?: ObjectType<any>;
  example?: Record<string, unknown>;
  schema?: {
    type: "string";
    format: "binary";
  };
}
