/**
 * Copyright 2020 Valentin Draganescu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { ObjectType } from "../object-type";
import { getMetadataStorage } from "../metadata/metadata-storage";
import {PropertyMetadata} from "../metadata/property-metadata";
import { Logger } from "../logger";

type PropType = "undefined" | "object" | "boolean" | "number" | "string" | "function" | "symbol" | "bigint";

const validateIsRequired = <T>(
  propMeta: PropertyMetadata,
  propertyValue: any,
  Model: ObjectType<T>,
  modelKey: string,
): string | null => {
  if (propMeta.isRequired && !propertyValue) {
    return `${Model.name}.${modelKey} is required`;
  }
  return null;
};

const validateIsCorrectType = <T>(
  propType: PropType,
  propMeta: PropertyMetadata,
  Model: ObjectType<T>,
  modelKey: string,
): string | null => {
  if (propType !== propMeta.type) {
    return `${Model.name}.${modelKey} should be of type ${propMeta.type}`;
  }
  return null;
};

const validateMinSize = <T>(
  propMeta: PropertyMetadata,
  propType: PropType,
  property: any,
  Model: ObjectType<T>,
  modelKey: string,
): string | null => {
  if (propMeta.minSize) {
    if (propType === "string" || (propType === "object" && Array.isArray(property))) {
      if (property.length < propMeta.minSize) {
        return `${Model.name}.${modelKey} should have a minimum size of ${propMeta.minSize}`;
      }
    }
    if (propType === "number" || propType === "bigint") {
      if (property < propMeta.minSize) {
        return `${Model.name}.${modelKey} should be at least ${propMeta.minSize}`;
      }
    }
  }
  return null;
};

const validateFormat = <T>(
  propMeta: PropertyMetadata,
  property: string,
  Model: ObjectType<T>,
  modelKey: string,
): string | null => {
  if (propMeta.format) {
    const regex = new RegExp(propMeta.format);
    const isCorrectFormat = regex.test(property);
    if (!isCorrectFormat) {
      return `${Model.name}.${modelKey} should have the format ${propMeta.format}`;
    }
  }
  return null;
};

const validateMaxSize = <T>(
  propMeta: PropertyMetadata,
  propType: PropType,
  property: any,
  Model: ObjectType<T>,
  modelKey: string,
): string | null => {
  if (propMeta.maxSize) {
    if (propType === "string" || (propType === "object" && Array.isArray(property))) {
      if (property.length > propMeta.maxSize) {
        return `${Model.name}.${modelKey} should have a maximum size of ${propMeta.minSize}`;
      }
    }
    if (propType === "number" || propType === "bigint") {
      if (property > propMeta.maxSize) {
        return `${Model.name}.${modelKey} should be at most ${propMeta.minSize}`;
      }
    }
  }
  return null;
};

const validateObject = (propMeta: PropertyMetadata, propertyVallue: any): string[] => {
  const errors: string[] = [];
  if (propMeta.objectType) {
    errors.push(...Validator.validate(propertyVallue, propMeta.objectType));
  } else {
    const message = `No entity defined for object ${JSON.stringify(propertyVallue)}`;
    console.error(message);
    errors.push(message);
  }
  return errors;
};

const validateRequiredProperties = <T>(
  property: any,
  propMeta: PropertyMetadata,
  Model: ObjectType<T>,
  modelKey: string,
): string[] => {
  const errors: string[] = [];
  let error: string | null;

  const propType = typeof property;
  const typeError = validateIsCorrectType(propType, propMeta, Model, modelKey);

  if (typeError) {
    errors.push(typeError);
  }

  if (!typeError) {
    error = validateMinSize(propMeta, propType, property, Model, modelKey);
    if (error) {
      errors.push(error);
    }

    error = validateMaxSize(propMeta, propType, property, Model, modelKey);
    if (error) {
      errors.push(error);
    }

    error = validateFormat(propMeta, property, Model, modelKey);
    if (error) {
      errors.push(error);
    }
  }
  return errors;
};

export class Validator {
  static validate = <T>(body: any, Model: ObjectType<T>): string[] => {
    Logger.log("Validating", Model.name);
    const errors: string[] = [];
    if (!body) {
      errors.push(`${Model.name} is required`);
      return errors;
    }
    const metadata = getMetadataStorage();
    const entityMeta = metadata.entities[Model.name];

    if (!entityMeta) {
      const message = `Entity ${Model.name} is not registered with the router, did you forget to decorate ${Model.name} with @DocModel()?`;
      console.error(message);
      errors.push(message);
    }

    const modelKeys = Object.keys(entityMeta);

    for (const modelKey of modelKeys) {
      const propMeta = entityMeta[modelKey];
      const propertyValue = body[modelKey];

      Logger.log(`Validating ${Model.name}.${modelKey}`);

      if (typeof propertyValue === "object") {
        Logger.log("Property is an object");
        errors.push(...validateObject(propMeta, propertyValue));
      } else {
        Logger.log("Property is a primitive with value", propertyValue);
        if (propMeta) {
          const error = validateIsRequired(propMeta, propertyValue, Model, modelKey);
          if (error) {
            errors.push(error);
          }

          if (propertyValue) {
            errors.push(...validateRequiredProperties(propertyValue, propMeta, Model, modelKey));
          }
        }
      }
    }
    return errors;
  };
}
