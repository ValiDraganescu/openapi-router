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


import {DocApi} from "./model/api";
import {getMetadataStorage} from "../metadata/metadata-storage";
import {DocPath} from "./model/paths";
import {DocResponses} from "./model/doc-responses";
import {RouteMetadata} from "../metadata/route-metadata";
import {RouterMetadata} from "../metadata/router-metadata";
import {PropertyMetadata} from "../metadata/property-metadata";

const resolveResponses = (routeMetadata: RouteMetadata): DocResponses => {
  const responses: DocResponses = {};
  for (const response of routeMetadata.responses) {
    responses[String(response.statusCode)] = {
      description: response.description
    };

    if (response.body && response.body.name) {
      responses[String(response.statusCode)].content = {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/${response.body?.name}`
          }
        }
      };
    }
  }
  return responses;
};

const generatePathDoc = (apiDoc: DocApi, metadata: RouterMetadata): DocApi => {
  const thisDoc = {...apiDoc};

  const paths = metadata.getPaths();
  thisDoc.paths = {};
  for (const path of paths) {
    if (!thisDoc.paths[path]) {
      thisDoc.paths[path] = new DocPath();
    }
    const methodMetadata = metadata.paths.get(path);
    if (methodMetadata) {
      const methods = Object.keys(methodMetadata);
      for (const method of methods) {
        if (!thisDoc.paths[path][method]) {
          const routeMetadata = methodMetadata[method];
          thisDoc.paths[path][method.toLowerCase()] = {
            description: routeMetadata.description,
            summary: routeMetadata.summary,
            operationId: `${method}-${path}`,
            security: routeMetadata.security
          };
          if (routeMetadata.responses) {
            thisDoc.paths[path][method.toLowerCase()].responses = resolveResponses(routeMetadata);
          }
          if (routeMetadata.requestBody) {
            thisDoc.paths[path][method.toLowerCase()].requestBody = {
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/${routeMetadata.requestBody?.name}`
                  }
                }
              }
            };
          }

          if (routeMetadata.parameters) {
            thisDoc.paths[path][method.toLowerCase()].parameters = routeMetadata.parameters;
          }
        }
      }
    }
  }
  return thisDoc;
};

const resolvePropertyDocumentation = (propMeta: PropertyMetadata): any => {
  if (propMeta.type === "object") {
    return {
      $ref: `#/components/schemas/${propMeta.objectType?.name}`
    };
  }
  const model: { [key: string]: any } = {
    type: propMeta.type,
    nullable: propMeta.nullable,
    description: propMeta.description,
    format: propMeta.format
  };
  if (propMeta.type === "string") {
    model.minLength = propMeta.minSize;
    model.maxLength = propMeta.maxSize;
  }
  if (propMeta.type === "number" || propMeta.type === "integer") {
    model.minimum = propMeta.minSize;
    model.maximum = propMeta.maxSize;
  }
  if (propMeta.type === "array") {
    model.minItems = propMeta.minSize;
    model.maxItems = propMeta.maxSize;
  }

  return model;
};

const resolveModelDocumentation = (
  propKeys: string[],
  metadata: RouterMetadata,
  entityName: string
): [any, string[]] => {
  const properties: any = {};
  const required: string[] = [];

  for (const propKey of propKeys) {
    const propMeta = metadata.entities[entityName][propKey];
    if (!propMeta) {
      console.error("No prop meta found for entity", propKey);
      continue;
    }

    properties[propKey] = resolvePropertyDocumentation(propMeta);

    if (propMeta.isRequired) {
      required.push(propKey);
    }
  }
  return [properties, required];
};

export const generateDoc = (version: string): DocApi => {
  const metadata = getMetadataStorage();

  let apiDoc = new DocApi();
  apiDoc.openapi = version;
  if (metadata.docMetadata) {
    const info = {...metadata.docMetadata};
    delete info.securitySchemes;
    delete info.security;
    delete info.servers;
    delete info.additionalRouters;
    apiDoc.info = info;
  }
  const schemas: any = {};
  const metadataEntities = Object.keys(metadata.entities);
  for (const entityName of metadataEntities) {
    const propKeys = Object.keys(metadata.entities[entityName]);
    const [properties, required] = resolveModelDocumentation(propKeys, metadata, entityName);

    schemas[entityName] = {
      properties
    };

    if (required.length) {
      schemas[entityName].required = required;
    }
  }

  apiDoc.components = {
    schemas
  };

  if (metadata.docMetadata?.securitySchemes) {
    apiDoc.components.securitySchemes = metadata.docMetadata.securitySchemes;
  }

  if (metadata.paths && metadata.paths.size) {
    apiDoc = generatePathDoc(apiDoc, metadata);
  }

  if (metadata.docMetadata?.security) {
    apiDoc.security = metadata.docMetadata.security;
  }

  if (metadata.docMetadata?.servers) {
    apiDoc.servers = metadata.docMetadata.servers;
  }

  return apiDoc;
};
