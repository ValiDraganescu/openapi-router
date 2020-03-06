import { DocProperty } from "..";

export class ApiError {
  @DocProperty({
    type: "string"
  })
  name?: string;

  @DocProperty({
    type: "string"
  })
  message?: string;
}
