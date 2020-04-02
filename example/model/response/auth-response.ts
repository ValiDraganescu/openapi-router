import { DocProperty } from "../../../src";
import { BaseResponse } from "./base-response";
import { InheritedDoc } from "../../../src/doc/decorators/doc";

@InheritedDoc()
export class AuthResponse extends BaseResponse {
  @DocProperty({
    type: "string"
  })
  message: string;
}
