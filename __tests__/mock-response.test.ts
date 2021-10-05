import { App } from "../example/app";
import { HttpMethod, Request } from "../src";

describe("testing the mock response", () => {
  it("should generate a mock response", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<{}>({
      headers: {
        "accept": "application/json"
      },
      path: "/hello-mock",
      method: HttpMethod.GET
    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.getBody().data.message).toBeDefined();

  });
});