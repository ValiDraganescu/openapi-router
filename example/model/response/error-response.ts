import { DocProperty } from "../../../src";

export class ErrorResponse {
  @DocProperty({
    type: "string"
  })
  name?: string;

  @DocProperty({
    type: "string"
  })
  message?: string;
}
