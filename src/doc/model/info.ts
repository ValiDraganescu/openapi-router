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


import { DocContact } from "./contact";
import { DocLicense } from "./license";
import { DocServer } from "./server";
import { DocSecurity } from "./doc-security";
import { SecuritySchemes } from "./security-schemes";
import { ObjectType } from "../../object-type";
import { ResponseMetadata } from "../../metadata/response-metadata";

export class DocInfo {
  version: string;
  title?: string;
  description?: string;
  termsOfService?: string;
  contact?: DocContact;
  license?: DocLicense;
  securitySchemes?: SecuritySchemes;
  security?: DocSecurity[];
  servers: DocServer[];
  additionalRouters?: ObjectType<any>[];
  globalResponses?: ResponseMetadata[];
}
