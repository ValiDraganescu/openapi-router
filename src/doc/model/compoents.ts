import {DocSchema} from "./schema";
import {DocSecurityScheme} from "./security-scheme";

export class DocComponents {
  schemas: {
    [key: string]: DocSchema
  };
  securitySchemes?: { [key in "BasicAuth" | "BearerAuth" | "ApiKeyAuth" | "OpenID" | "OAuth2"]?: DocSecurityScheme };
}
