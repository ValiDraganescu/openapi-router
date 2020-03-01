import {PropertyType} from "../property-type";
import {DocItems} from "./item";

export class DocSchema {
  type?: PropertyType;
  items?: DocItems;
  $ref?: string;
  format?: string;
  properties?: { [key: string]: any };
  enum?: string[];
}
