import {DocSchema} from "./schema";

export class DocContent {
  [key: string]: ContentType;
}

export class ContentType {
  schema: DocSchema;
}

// export class DocContentProperty {
//   type: string;
// }
//
// export class DocContentSchema {
//   type: string;
//   required: string[];
//   properties: {
//     [key: string]: DocContentProperty
//   };
// }
