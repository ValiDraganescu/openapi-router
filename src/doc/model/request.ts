import {DocContent} from "./contents";

export class DocRequest {
  required: boolean = true;
  description?: string;
  content: DocContent;
}
