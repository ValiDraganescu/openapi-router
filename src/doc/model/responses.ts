import {DocContent} from "./contents";

export class DocResponses {
  [key: string]: DocResponse;
}

export class DocResponse {
  description: string;
  content?: DocContent;
}
