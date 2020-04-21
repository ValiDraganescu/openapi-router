import { DocProperty } from "../../../src";
import { BaseResponse } from "./base-response";
import { InheritedDoc } from "../../../src";
import { AuthData } from "../model/auth-data";

@InheritedDoc()
export class AuthResponse extends BaseResponse {
  @DocProperty({
    type: "object",
    objectType: AuthData.name,
    isRequired: true
  })
  data: AuthData;
}
