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
