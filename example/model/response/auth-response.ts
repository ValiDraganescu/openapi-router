import { DocProperty } from "../../../src";

export class AuthResponse {
  @DocProperty({
    type: "string"
  })
  message: string;
}
