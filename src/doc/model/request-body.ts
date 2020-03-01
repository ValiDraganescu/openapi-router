import {DocContact} from "./contact";

export class DocRequestBody {
  description: string;
  required: boolean;
  content: DocContact;
}
