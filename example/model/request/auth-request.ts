import {DocProperty} from "../../../src";
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
    description: 'the type of the user',
    type: "string",
    isRequired: true,
    enum: ['user', 'admin']
  })
  type: string;

  @DocProperty({
    type: "object",
    objectType: UserDetails.name,
    isRequired: true
  })
  userDetails: UserDetails;

  @DocProperty({
    type: "array",
    objectType: "string",
    isRequired: true,
    minSize: 1,
    maxSize: 3
  })
  items: string[]
}
