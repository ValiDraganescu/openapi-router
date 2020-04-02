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

import { getMetadataStorage } from "../../metadata/metadata-storage";
import { PropertyMetadata } from "../../metadata/property-metadata";

export const DocProperty = (props: PropertyMetadata) => {
  return (target: any, propertyKey: string) => {
    const metadata = getMetadataStorage();
    if (!metadata.entities[target.constructor.name]) {
      metadata.entities[target.constructor.name] = {};
    }

    if (props) {
      metadata.entities[target.constructor.name][propertyKey] = props;
    }
  };
};

export const InheritedDoc = () => {
  return (target: any) => {
    const protoName = Object.getPrototypeOf(target).name;

    if (protoName !== "Object") {
      const metadata = getMetadataStorage();
      if (!metadata.entities[target.constructor.name]) {
        metadata.entities[target.constructor.name] = {};
      }
      if (metadata.entities[protoName]) {
        metadata.entities[target.constructor.name] = {
          ...metadata.entities[target.constructor.name],
          ...metadata.entities[protoName],
        };
      }
    }
  };
};
