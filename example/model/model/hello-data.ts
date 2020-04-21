import { DocProperty } from "../../../src";

export class HelloData {
  @DocProperty({
    type: "string"
  })
  message: string;
}
