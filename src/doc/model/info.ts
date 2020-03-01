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

import {DocContact} from "./contact";
import {DocLicense} from "./license";
import {DocSecurityScheme} from "./security-scheme";
import {DocServer} from "./server";

export class DocInfo {
  version: string;
  title?: string;
  description?: string;
  termsOfService?: string;
  contact?: DocContact;
  license?: DocLicense;
  securitySchemes?: { [key in "BasicAuth" | "BearerAuth" | "ApiKeyAuth" | "OpenID" | "OAuth2"]?: DocSecurityScheme };
  security?: {[key: string]: any[]}[];
  servers: DocServer[];
}
