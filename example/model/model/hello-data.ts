import { DocProperty } from "../../../src";

export class HelloData {
  @DocProperty({
    type: "string",
    isRequired: true
  })
  message: string;

  @DocProperty({
    type: "number",
    isRequired: false
  })
  teamSize?: number;
}
