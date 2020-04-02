import { DocProperty } from "../../../src";

export class BaseResponse {
  @DocProperty({
    type: "string"
  })
  baseItem: string;
}
