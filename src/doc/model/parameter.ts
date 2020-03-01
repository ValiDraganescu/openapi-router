import {DocSchema} from "./schema";

export class DocParameter {
  name: string;
  in: "query" | "path" | "body" | "cookie";
  description: string;
  required: boolean;
  schema: DocSchema;
  style?: "form";
  deprecated?: boolean;
}
