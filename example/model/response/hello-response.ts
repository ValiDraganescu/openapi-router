import {DocProperty} from "../../../src";
import { BaseResponse } from "./base-response";
import { InheritedDoc } from "../../../src";

@InheritedDoc()
export class HelloResponse extends BaseResponse {
  @DocProperty({
    type: "string"
  })
  message: string;
}
