/**
 Copyright 2020 Valentin Draganescu

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { DocInfo } from "./info";
import { DocServer } from "./server";
import { DocPath } from "./paths";
import { DocComponents } from "./compoents";

export class DocApi {
  openapi: string = "3.0.0";
  info: DocInfo;
  servers: DocServer[];
  paths: { [key: string]: DocPath };
  components: DocComponents;
  security?: { [key: string]: any[] }[];
}
