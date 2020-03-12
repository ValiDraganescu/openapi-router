import { PropertyType } from "../doc/property-type";
import { ObjectType } from "../object-type";

export class PropertyMetadata {
  type: PropertyType;
  nullable?: boolean;
  objectType?: ObjectType<any>;
  minSize?: number;
  maxSize?: number;
  isRequired?: boolean;
  description?: string;
  format?: string;
}
