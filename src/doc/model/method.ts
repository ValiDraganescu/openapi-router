import {DocParameter} from "./parameter";
import {DocResponses} from "./responses";
import {DocRequest} from "./request";

export class DocMethod {
  operationId: string;
  summary: string;
  description: string;
  responses: DocResponses;
  parameters: DocParameter[];
  requestBody: DocRequest;
  security: any[];
}
