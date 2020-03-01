import {DocProperty} from "../../../src/doc/decorators/doc";

export class ResponseEnvelope<T> {
  @DocProperty({
    type: "object"
  })
  errors?: any;

  @DocProperty({
    type: "object"
  })
  value: T;
}
