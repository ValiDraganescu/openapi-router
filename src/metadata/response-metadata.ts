import {ObjectType} from "../object-type";

export class ResponseMetadata {
  statusCode: number;
  description: string;
  body?: ObjectType<any>;
}
