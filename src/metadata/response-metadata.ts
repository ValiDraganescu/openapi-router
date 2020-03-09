import { ObjectType } from "../object-type";

export class ResponseMetadata {
  statusCode: number;
  description: string;
  type?: "object" | "array";
  body?: ObjectType<any>;
}
