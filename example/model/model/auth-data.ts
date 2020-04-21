import { DocProperty } from "../../../src";

export class AuthData {
  @DocProperty({
    type: "string"
  })
  message: string;
}
