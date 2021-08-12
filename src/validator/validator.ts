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

import { getMetadataStorage } from "../metadata/metadata-storage";
import { PropertyMetadata } from "../metadata/property-metadata";
import { Logger } from "../logger";
import { ApiError } from "../router/api-error";

type PropType = "undefined" | "object" | "array" | "boolean" | "number" | "string" | "function" | "symbol" | "bigint";

const validateIsRequired = (
  propMeta: PropertyMetadata,
  propertyValue: any,
  modelName: string,
  modelKey: string
): string | null => {
  if (propMeta.isRequired && (propertyValue === undefined || propertyValue === null)) {
    // return `${modelName}.${modelKey} is required`;
    return `${modelKey} is required`;
  }
  return null;
};

const validateIsCorrectType = (
  propType: PropType,
  propMeta: PropertyMetadata,
  modelName: string,
  modelKey: string
): string | null => {
  Logger.log("Validating type", propType, propMeta, modelName, modelKey);
  if (propType === "number" || propType === "bigint") {
    if (propMeta.type !== "number" && propMeta.type !== "integer") {
      // return `${modelName}.${modelKey} should be of type ${propMeta.type}`;
      return `${modelKey} should be of type ${propMeta.type}`;
    }
  }
  /*else if (propType === 'object' && Array.isArray(propMeta.objectType)) {

  }
    if (propType !== propMeta.type) {
      return `${modelName}.${modelKey} should be of type ${propMeta.type}`;
    }*/


  return null;
};

const validateMinSize = (
  propMeta: PropertyMetadata,
  propType: PropType,
  property: any,
  modelName: string,
  modelKey: string
): string | null => {
  Logger.log(`validating minSize ${propMeta.minSize} for propType ${propType}`);
  if (propMeta.minSize) {
    if (propType === "string" || propType === "object" || propType === "array") {
      Logger.log(`Length is ${property.length}`);
      if (property.length < propMeta.minSize) {
        // return `${modelName}.${modelKey} should have a minimum size of ${propMeta.minSize}`;
        return `${modelKey} should have a minimum size of ${propMeta.minSize}`;
      }
    }
    if (propType === "number" || propType === "bigint") {
      if (property < propMeta.minSize) {
        // return `${modelName}.${modelKey} should be at least ${propMeta.minSize}`;
        return `${modelKey} should be at least ${propMeta.minSize}`;
      }
    }
  }
  return null;
};

const validateFormat = (
  propMeta: PropertyMetadata,
  property: string,
  modelName: string,
  modelKey: string
): string | null => {
  if (propMeta.format) {
    const regex = new RegExp(propMeta.format);
    const isCorrectFormat = regex.test(property);
    if (!isCorrectFormat) {
      // return `${modelName}.${modelKey} should have the format ${propMeta.format}`;
      return `${modelKey} should have the format ${propMeta.format}`;
    }
  }
  return null;
};

const validateMaxSize = (
  propMeta: PropertyMetadata,
  propType: PropType,
  property: any,
  modelName: string,
  modelKey: string
): string | null => {
  if (propMeta.maxSize) {
    if (propType === "string" || propType === "object" || propType === "array") {
      if (property.length > propMeta.maxSize) {
        // return `${modelName}.${modelKey} should have a maximum size of ${propMeta.maxSize}`;
        return `${modelKey} should have a maximum size of ${propMeta.maxSize}`;
      }
    }
    if (propType === "number" || propType === "bigint") {
      if (property > propMeta.maxSize) {
        // return `${modelName}.${modelKey} should be at most ${propMeta.maxSize}`;
        return `${modelKey} should be at most ${propMeta.maxSize}`;
      }
    }
  }
  return null;
};

const validateObject = (propMeta: PropertyMetadata, propertyValue: any): ApiError[] => {
  const errors: ApiError[] = [];
  if (propMeta.objectType) {
    errors.push(...Validator.validate(propertyValue, propMeta.objectType));
  } else {
    const message = `No entity defined for object ${JSON.stringify(propertyValue)}`;
    console.error(message);
    errors.push({ message });
  }
  return errors;
};

const validateRequiredProperties = (
  property: any,
  propMeta: PropertyMetadata,
  modelName: string,
  modelKey: string
): ApiError[] => {
  const errors: ApiError[] = [];
  let error: string | null;

  let propType: PropType = typeof property;
  if (propType === "object" && Array.isArray(property)) {
    propType = "array";
  }
  const typeError = validateIsCorrectType(propType, propMeta, modelName, modelKey);

  if (typeError) {
    errors.push({ message: typeError });
  }

  if (!typeError) {
    error = validateMinSize(propMeta, propType, property, modelName, modelKey);
    if (error) {
      errors.push({ message: error });
    }

    error = validateMaxSize(propMeta, propType, property, modelName, modelKey);
    if (error) {
      errors.push({ message: error });
    }

    error = validateFormat(propMeta, property, modelName, modelKey);
    if (error) {
      errors.push({ message: error });
    }
  }
  return errors;
};

const baseTypes = ["string", "number"];

export class Validator {
  static validate = (body: any, objectType: string | string[]): ApiError[] => {


    let modelNames: string[];
    if (Array.isArray(objectType)) {
      modelNames = objectType;
    } else {
      modelNames = [objectType];
    }

    const errors: ApiError[] = [];

    for (const modelName of modelNames) {
      Logger.log("Validating", modelName, JSON.stringify(body));
      const metadata = getMetadataStorage();
      const entityMeta = metadata.entities[modelName];

      if (!entityMeta && !baseTypes.includes(modelName)) {
        const message = `Entity ${modelName} is not registered with the router`;
        console.error(message);
        errors.push({ message });
      }

      if (entityMeta && (body === null || body === undefined)) {
        if (entityMeta) {
          Logger.log('entity metadata', JSON.stringify(entityMeta));
          errors.push({
            message: `${modelName} is required`
          });
          return errors;
        }
      }


      if (Array.isArray(body)) {
        for (const item of body) {
          errors.push(...Validator.validate(item, modelName));
        }
      } else {
        if (typeof body === "object" && entityMeta !== undefined) {
          try {
            const modelKeys = Object.keys(entityMeta);

            for (const modelKey of modelKeys) {
              const propMeta = entityMeta[modelKey];
              const propertyValue = body[modelKey];

              Logger.log(`Validating ${modelName}.${modelKey}`);

              if (typeof propertyValue === "object" && propertyValue !== null) {
                Logger.log("Property is an object");
                errors.push(...validateRequiredProperties(propertyValue, propMeta, modelName, modelKey));
                errors.push(...validateObject(propMeta, propertyValue));
              } else {
                Logger.log("Property is a primitive with value", propertyValue);
                Logger.log("Validating with propMeta", propMeta);
                if (propMeta) {
                  const error = validateIsRequired(propMeta, propertyValue, modelName, modelKey);
                  if (error) {
                    errors.push({ message: error });
                  }

                  if (propertyValue !== undefined && propertyValue !== null) {
                    errors.push(...validateRequiredProperties(propertyValue, propMeta, modelName, modelKey));
                  }
                }
              }
            }
          } catch (err) {
            Logger.log("validation failed", err);
            Logger.log("body", body, objectType, entityMeta, modelName);
          }
        }
      }
    }

    return errors;
  };
}
