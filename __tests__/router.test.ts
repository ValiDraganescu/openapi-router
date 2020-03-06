import {App} from "../example/app";
import {Request} from "../src";
import {HttpMethod} from "../src";

describe("Test the routing capabilities", () => {

  it("should test say hello handler", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<{}>({
      headers: {
        "accept": "application/json"
      },
      path: "/hello",
      method: HttpMethod.GET
    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.data.message).toEqual("hello");
  });

  it("should test say hello with POST handler", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/hello",
      method: HttpMethod.POST
    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.data.message).toEqual("hello with POST");
  });

  it("should return 404 when a route is not found", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/hello/organization/team/name/not-found",
      method: HttpMethod.GET
    }));
    expect(resp.statusCode).toEqual(404);
    expect(resp.data).not.toBeDefined();
  });

  it("should test say hello foo handler", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/hello/foo",
      method: HttpMethod.GET
    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.data.message).toEqual("hello foo");
  });

  it("should test say hello foo john handler", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/hello/pokemon/rocket/james",
      method: HttpMethod.GET

    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.data.message).toEqual("hello james from rocket team of pokemon");
  });

  it("should test handler with body", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/auth",
      method: HttpMethod.POST,
      body: {
        email: "test@test.test",
        password: "very_secret",
        userDetails: {
          firstName: "John"
        }
      }
    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.data.message).toEqual("Auth email address is test@test.test and password is very_secret");
  });

  it("should test handler with body and path params", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/auth/admin",
      method: HttpMethod.POST,
      body: {
        email: "test@test.test",
        password: "very_secret",
        userDetails: {
          firstName: "John"
        }
      }
    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.data.message).toEqual("Auth email address is test@test.test and password is very_secret, logging in as admin");
  });

  it("should test delete user", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/users/1",
      method: HttpMethod.DELETE
    }));
    expect(resp.statusCode).toEqual(204);
  });

  it("should test update user", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/users/1",
      method: HttpMethod.PUT,
      body: {
        email: "test@test.test"
      }
    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.data.email).toEqual("test@test.test");
  });

  it("should correctly execute before middleware", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/auth-before",
      method: HttpMethod.POST,
      body: {
        email: "test@test.test",
        password: "very_secret",
        userDetails: {
          firstName: "John"
        }
      }
    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.data.message).toEqual("Auth email address is before-test@test.test and password is very_secret");
  });

  it("should correctly execute after middleware", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/auth-after",
      method: HttpMethod.POST,
      body: {
        email: "test@test.test",
        password: "very_secret",
        userDetails: {
          firstName: "John"
        }
      }
    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.data.message).toEqual("Auth email address is test@test.test and password is very_secret after");
  });

  it("should correctly execute before and after middleware", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/auth-before-and-after",
      method: HttpMethod.POST,
      body: {
        email: "test@test.test",
        password: "very_secret",
        userDetails: {
          firstName: "John"
        }
      }
    }));
    expect(resp.statusCode).toEqual(200);
    expect(resp.data.message).toEqual("Auth email address is before-test@test.test and password is very_secret after");
  });
});
