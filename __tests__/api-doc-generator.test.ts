import { App } from "../example/app";
import { DocApi } from "../src/doc/model/api";
import { HttpMethod, Request } from "../src";

describe("Test the api doc generation capabilities", () => {

  let doc: DocApi;

  beforeEach(async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<{}>({
      headers: {
        "accept": "application/json"
      },
      path: "/api/doc",
      method: HttpMethod.GET
    }));
    doc = resp.getBody() as DocApi;
  });

  it("should document api metadata", async () => {
    expect(doc.openapi).toEqual("3.0.0");

  });

  it("should document api info", () => {
    const info = doc.info;
    expect(info.termsOfService).toEqual("https://technoloid.com/terms");
    expect(info.title).toEqual("A test app");
    expect(info.description).toEqual("Exactly as the name suggests");

    const contact = info.contact;
    expect(contact).toBeDefined();
    expect(contact?.email).toEqual("vali.draganescu88@gmail.com");
    expect(contact?.name).toEqual("Vali Draganescu");
    expect(contact?.url).toEqual("https://technoloid.com");

    const license = info.license;
    expect(license).toBeDefined();
    expect(license?.name).toEqual("DWETFYW | Do what ever the fuck you want");
    expect(license?.url).toEqual("https://technoloid.com/license");
  });

  it("should document api paths", () => {
    const paths = doc.paths;
    expect(paths).toBeDefined();
    const helloPath = paths["/hello"];
    expect(helloPath).toBeDefined();
    expect(helloPath.get).toBeDefined();
    expect(helloPath.get.description).toEqual("simple method, just says hello to the user");
    expect(helloPath.get.summary).toEqual("This is the summary");
    const okayResponse = helloPath.get.responses["200"];
    expect(okayResponse).toBeDefined();
    expect(okayResponse.description).toEqual("hello response");
    expect(okayResponse.content).toBeDefined();
    let appJson = okayResponse.content["application/json"];
    expect(appJson).toBeDefined();
    expect(appJson.schema).toBeDefined();
    expect(appJson.schema.$ref).toEqual("#/components/schemas/HelloResponse");

    const internalServerErrorResponse = helloPath.get.responses["500"];
    expect(internalServerErrorResponse).toBeDefined();
    expect(internalServerErrorResponse.description).toEqual("Internal server error");
    expect(internalServerErrorResponse.content).toBeDefined();
    appJson = internalServerErrorResponse.content["application/json"];
    expect(appJson).toBeDefined();
    expect(appJson.schema).toBeDefined();
    expect(appJson.schema.items.$ref).toEqual("#/components/schemas/BaseResponse");

    const badRequestResponse = helloPath.get.responses["400"];
    expect(badRequestResponse).toBeDefined();
    expect(badRequestResponse.description).toEqual("Bad request");
    expect(badRequestResponse.content).toBeDefined();
    appJson = badRequestResponse.content["application/json"];
    expect(appJson).toBeDefined();
    expect(appJson.schema).toBeDefined();
    expect(appJson.schema.type).toEqual("array");
    expect(appJson.schema.items).toBeDefined();
    expect(appJson.schema.items.$ref).toEqual("#/components/schemas/BaseResponse");
  });

  it("should document one schema", () => {
    expect(doc.components).toBeDefined();
    expect(doc.components.schemas).toBeDefined();
    const helloResponseSchema = doc.components.schemas.HelloResponse;
    expect(helloResponseSchema).toBeDefined();
    expect(typeof helloResponseSchema).toBe("object");
    expect(helloResponseSchema.properties).toBeDefined();
    expect(helloResponseSchema.properties!.data.$ref).toEqual("#/components/schemas/HelloData");
  });

  it("should document fully inherited schema", () => {
    expect(doc.components).toBeDefined();
    expect(doc.components.schemas).toBeDefined();
    const inheritedResponse = doc.components.schemas.InheritedResponse;
    expect(inheritedResponse).toBeDefined();
    expect(typeof inheritedResponse).toBe("object");
    expect(inheritedResponse.properties).toBeDefined();
    const errors = inheritedResponse.properties?.errors;
    expect(errors).toBeDefined();
    expect(errors.type).toEqual("array");
    expect(errors.items).toBeDefined();
  });

  it("should document internal server error schema", () => {
    expect(doc.components).toBeDefined();
    expect(doc.components.schemas).toBeDefined();
    const errorResponseSchema = doc.components.schemas.BaseResponse;
    expect(errorResponseSchema).toBeDefined();
    expect(typeof errorResponseSchema).toBe("object");
    expect(errorResponseSchema.properties).toBeDefined();
    const errors = errorResponseSchema.properties?.errors;
    expect(errors).toBeDefined();
    expect(errors.type).toEqual("array");
    expect(errors.items.$ref).toEqual("#/components/schemas/ApiError");
  });

  it("should document all schemas", () => {
    const schemas = Object.values(doc.components.schemas);
    const schemaNames = Object.keys(doc.components.schemas);
    expect(schemaNames).not.toContain("Function");
    const expectedTypes = ["string", "number", "integer", "boolean", "array", "complex"];

    expect(schemas.length).toBeGreaterThan(1);
    for (const schema of schemas) {
      expect(schema.properties).toBeDefined();
      const propNames = Object.keys(schema.properties!);
      expect(propNames.length).toBeGreaterThan(0);
      for (const propName of propNames) {
        const prop = schema.properties![propName];
        expect(prop).toBeDefined();
        if (prop.type) {
          expect(expectedTypes).toContain(prop.type);
        } else if (prop.oneOf) {
          expect(Array.isArray(prop.oneOf)).toEqual(true);
          expect(prop.oneOf.length).toBeGreaterThan(1);
          for (const item of prop.oneOf) {
            if (item.type) {
              expect(expectedTypes).toContain(item.type);
            } else {
              expect(item.$ref).toBeDefined();
              expect(typeof item.$ref).toEqual("string");
            }
          }
        } else {
          expect(prop.$ref).toBeDefined();
          expect(typeof prop.$ref).toEqual("string");
        }
      }
    }
  });

  it("should document hello request body", () => {
    const paths = doc.paths;
    expect(paths).toBeDefined();
    const helloPath = paths["/auth"];
    expect(helloPath.post).toBeDefined();
    expect(helloPath.post.description).toEqual("Post method with body");
    expect(helloPath.post.summary).toEqual("A POST method with request and response bodies");
    expect(helloPath.post.security).toBeDefined();
    expect(Array.isArray(helloPath.post.security)).toEqual(true);
    expect(helloPath.post.security.length).toEqual(1);
    const reqBody = helloPath.post.requestBody;
    expect(reqBody).toBeDefined();
    expect(reqBody.content).toBeDefined();
    expect(reqBody.content["application/json"]).toBeDefined();
    const schema = reqBody.content["application/json"].schema;
    expect(schema).toBeDefined();
    expect(schema.$ref).toEqual("#/components/schemas/AuthRequest");

  });

  it("should test that an api has the correct parameters", () => {
    const paths = doc.paths;
    expect(paths).toBeDefined();
    const userPath = paths["/users/{id}"];
    expect(userPath).toBeDefined();
    expect(userPath.delete).toBeDefined();
    const params = userPath.delete.parameters;
    expect(params).toBeDefined();
    const idParam = params[0];
    expect(idParam).toBeDefined();
    expect(idParam.in).toEqual("path");
    expect(idParam.required).toEqual(true);
    expect(idParam.name).toEqual("id");
    expect(idParam.description).toEqual("The user id");
    expect(idParam.schema).toBeDefined();
    expect(idParam.schema.type).toEqual("number");

  });

  it("should test that security schemes are included", () => {
    const securitySchemes = doc.components.securitySchemes;
    expect(securitySchemes).toBeDefined();
    expect(securitySchemes!.ApiKeyAuth).toBeDefined();
    expect(securitySchemes!.BearerAuth).toBeDefined();
    expect(doc.security).toBeDefined();
    expect(doc.security!.length).toEqual(2);

    const apiKeyAuth = doc.security![0];
    expect(apiKeyAuth).toBeDefined();
    expect(apiKeyAuth.ApiKeyAuth).toBeDefined();
    expect(Array.isArray(apiKeyAuth.ApiKeyAuth)).toEqual(true);
    expect(apiKeyAuth.ApiKeyAuth.length).toEqual(0);

    const bearerAuth = doc.security![1];
    expect(bearerAuth).toBeDefined();
    expect(bearerAuth.BearerAuth).toBeDefined();
    expect(Array.isArray(bearerAuth.BearerAuth)).toEqual(true);
    expect(bearerAuth.BearerAuth.length).toEqual(0);
  });

  it("should define servers", () => {
    const servers = doc.servers;
    expect(servers).toBeDefined();
    expect(Array.isArray(servers)).toEqual(true);
    expect(servers.length).toEqual(3);
    for (const server of servers) {
      expect(typeof server.url).toEqual("string");
      expect(typeof server.description).toEqual("string");
    }
  });

});
