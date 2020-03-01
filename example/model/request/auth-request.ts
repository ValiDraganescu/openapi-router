import {DocProperty} from "../../../src/doc/decorators/doc";
import {UserDetails} from "../user-details";

export class AuthRequest {

  @DocProperty({
    description: "the user email address",
    type: "string",
    isRequired: true,
    maxSize: 256
  })
  email: string;

  @DocProperty({
    description: "the user email password",
    type: "string",
    isRequired: true,
    maxSize: 256
  })
  password: string;

  @DocProperty({
    type: "object",
    objectType: UserDetails,
    isRequired: true
  })
  userDetails: UserDetails;
}
