import {DocProperty} from "../../../src";
import { BaseResponse } from "./base-response";
import { InheritedDoc } from "../../../src";
import { HelloData } from "../model/hello-data";

@InheritedDoc()
export class HelloResponse extends BaseResponse {
  @DocProperty({
    type: "object",
    objectType: HelloData.name,
    isRequired: false
  })
  data?: HelloData;
}
