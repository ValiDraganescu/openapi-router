import {DocProperty} from "../../../src/doc/decorators/doc";

export class AuthResponse {
  @DocProperty({
    type: "string"
  })
  message: string;
}
