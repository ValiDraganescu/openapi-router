import { DocProperty } from "../../../src";
import { BaseResponse } from "./base-response";

export class AuthResponse extends BaseResponse {
  @DocProperty({
    type: "string"
  })
  message: string;
}
