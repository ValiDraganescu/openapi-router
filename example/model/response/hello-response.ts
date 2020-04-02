import {DocProperty} from "../../../src";
import { BaseResponse } from "./base-response";

export class HelloResponse extends BaseResponse {
  @DocProperty({
    type: "string"
  })
  message: string;
}
