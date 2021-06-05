import { DocProperty } from "../../../src";
import { HelloData } from "./hello-data";

export class AuthData {
  @DocProperty({
    type: "string"
  })
  message: string;

  @DocProperty({
    type: "array",
    objectType: [
      "string",
      HelloData.name
    ],
    isRequired: false
  })
  multiType?: HelloData[] | string[];
}
