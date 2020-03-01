import {App} from "../example/app";
import {Request} from "../src/router/event";
import {DocApi} from "../src/doc/model/api";
import {HttpMethod} from "../src/doc/http-method";

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
    doc = resp.body as DocApi;
    console.log("Api Doc::", JSON.stringify(doc));
  });

  it("should document api metadata", async () => {
    console.log(JSON.stringify(doc));
    expect(doc.openapi).toEqual("3.0.0");
  });

  it("should document api info", function () {
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

  it("should document api paths", function () {
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
    const appJson = okayResponse.content["application/json"];
    expect(appJson).toBeDefined();
    expect(appJson.schema).toBeDefined();
    expect(appJson.schema.$ref).toEqual("#/components/schemas/HelloResponse");
  });

  it("should document one schema", function () {
    expect(doc.components).toBeDefined();
    expect(doc.components.schemas).toBeDefined();
    const helloResponseSchema = doc.components.schemas.HelloResponse;
    expect(helloResponseSchema).toBeDefined();
    expect(typeof helloResponseSchema).toBe("object");
    expect(helloResponseSchema.properties).toBeDefined();
    const messageProp = helloResponseSchema.properties?.message;
    expect(messageProp).toBeDefined();
    expect(messageProp.type).toEqual("string");
  });

  it("should document all schemas", function () {
    const schemas = Object.values(doc.components.schemas);
    const schemaNames = Object.keys(doc.components.schemas);
    expect(schemaNames).not.toContain("Function");
    const expectedTypes = ["string", "number", "integer", "boolean", "array"];

    expect(schemas.length).toBeGreaterThan(1);
    for (let schema of schemas) {
      expect(schema.properties).toBeDefined();
      const propNames = Object.keys(schema.properties!);
      expect(propNames.length).toBeGreaterThan(0);
      for (let propName of propNames) {
        const prop = schema.properties![propName];
        expect(prop).toBeDefined();
        if (prop.type) {
          expect(expectedTypes).toContain(prop.type);
        } else {
          expect(prop.$ref).toBeDefined();
          expect(typeof prop.$ref).toEqual("string");
        }
      }
    }
  });

  it("should document hello request body", function () {
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

  it("should test that an api has the correct parameters", function () {
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

  it("should test that security schemes are included", function () {
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

  it("should define servers", function () {
    const servers = doc.servers;
    expect(servers).toBeDefined();
    expect(Array.isArray(servers)).toEqual(true);
    expect(servers.length).toEqual(3);
    for (let server of servers) {
      expect(typeof server.url).toEqual("string");
      expect(typeof server.description).toEqual("string");
    }
  });

});
