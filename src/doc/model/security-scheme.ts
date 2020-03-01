export class DocSecurityScheme {
  type: "http" | "apiKey" | "openIdConnect";
  scheme?: "basic" | "bearer";
  in?: "header";
  name?: string | "X-API-Key";
  openIdConnectUrl?: string;
}
