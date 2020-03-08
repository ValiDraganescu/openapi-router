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
import { MethodMetadata } from "./method-metadata";
import { DocInfo } from "..";
import { ModelMetadata } from "./model-metadata";


export class RouterMetadata {
  paths: Map<string, MethodMetadata> = new Map<string, MethodMetadata>();
  entities: { [key: string]: ModelMetadata } = {};
  docMetadata?: DocInfo;

  getPaths = (): string[] => {
    return Array.from(this.paths.keys());
  };
}
