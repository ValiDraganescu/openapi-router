import {App} from "../example/app";
import { Request, StatusCode } from "../src";
import {HttpMethod} from "../src";
import { ApiError } from "../src/router/api-error";

describe("Test the validation capabilities", () => {

  it("should test one missing params in request", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/auth",
      method: HttpMethod.POST,
      body: {
        password: "very_secret",
        userDetails: {
          firstName: "John"
        },
        items: [
          "foo",
          "bar"
        ]
      }
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(1);
    expect(errors[0].message).toEqual("AuthRequest.email is required");
  });

  it("should test all missing params in request", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json",
      },
      path: "/auth",
      method: HttpMethod.POST,
      body: {
        userDetails: {
          firstName: "John"
        },
        items: [
          "foo",
          "bar"
        ]
      }
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(2);
    expect(errors[0].message).toEqual("AuthRequest.email is required");
    expect(errors[1].message).toEqual("AuthRequest.password is required");
  });

  it("should test missing body in request", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/auth",
      method: HttpMethod.POST
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(1);
    expect(errors[0].message).toEqual("AuthRequest is required");
  });

  it("should test wrong type sent to API", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/auth",
      method: HttpMethod.POST,
      body: {
        email: "sasas@sdsasd.com",
        password: 1234,
        userDetails: {
          firstName: "John",
          lastName: 12121
        },
        items: [
          "foo",
          "bar"
        ]
      }
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(2);
    expect(errors[0].message).toEqual("AuthRequest.password should be of type string");
    expect(errors[1].message).toEqual("UserDetails.lastName should be of type string");
  });

  it("should test validating object property", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/auth",
      method: HttpMethod.POST,
      body: {
        email: "sasas@sdsasd.com",
        password: 1234,
        items: [
          "foo",
          "bar"
        ]
      }
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    console.log(errors);
    expect(errors.length).toEqual(2);
    expect(errors.map((e: ApiError) => e.message)).toContain("AuthRequest.password should be of type string");
    expect(errors.map((e: ApiError) => e.message)).toContain("AuthRequest.userDetails is required");
  });

  it("should test validating object property properties", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/auth",
      method: HttpMethod.POST,
      body: {
        email: "sasas@sdsasd.com",
        password: "password",
        userDetails: {
          lastName: "John"
        },
        items:[
          "foo",
          "bar"
        ]
      }
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(1);
    expect(errors.map((e: ApiError) => e.message)).toContain("UserDetails.firstName is required");
  });

  it("should test validating an error message", async () => {
    const app = new App();
    const resp = await app.consumeEvent(new Request<any>({
      headers: {
        "accept": "application/json"
      },
      path: "/error-method",
      method: HttpMethod.GET
    }));
    expect(resp.statusCode).toEqual(StatusCode.notFound);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(1);
    expect(errors.map((e: ApiError) => e.message)).toContain("foo");
    expect(errors.map((e: ApiError) => e.code)).toContain("bar");
  });
});
