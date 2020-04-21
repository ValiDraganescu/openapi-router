import { DocProperty } from "../../../src";
import { Envelope } from "../../../src";
import { ApiError } from "../../../src/router/api-error";

export class BaseResponse implements Envelope {
  @DocProperty({
    type: "array",
    objectType: ApiError.name,
    isRequired: false
  })
  errors?: ApiError[];
}
