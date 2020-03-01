import {DocProperty} from "../../src/doc/decorators/doc";

export class UserDetails {

  @DocProperty({
    type: "string",
    isRequired: true,
    description: "the users first name"
  })
  firstName: string;

  // TODO add a test that will check if a props is not required
  // but if it's still present, the other checks will be verified

  @DocProperty({
    type: "string",
    isRequired: false
  })
  lastName?: string;
}
