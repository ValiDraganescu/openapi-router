import { PropertyType } from "../doc/property-type";

export class PropertyMetadata {
  type: PropertyType;
  nullable?: boolean;
  objectType?: string | string[];
  minSize?: number;
  maxSize?: number;
  isRequired?: boolean;
  description?: string;
  format?: string;
  enum?: string[];
}
