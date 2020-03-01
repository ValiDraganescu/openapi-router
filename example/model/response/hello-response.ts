import {DocProperty} from "../../../src/doc/decorators/doc";

export class HelloResponse {
  @DocProperty({
    type: "string"
  })
  message: string;
}
