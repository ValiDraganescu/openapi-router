import { DocProperty } from "../../../src";
import { HelloData } from "./hello-data";

export class AuthData {
  @DocProperty({
    type: "string"
  })
  message: string;

  @DocProperty({
    type: "complex",
    objectType: [
      "string",
      HelloData.name
    ],
    isRequired: false
  })
  multiType?: string | HelloData;
}
