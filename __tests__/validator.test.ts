import {App} from "../example/app";
import {Request} from "../src";
import {HttpMethod} from "../src";

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
        }
      }
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual("AuthRequest.email is required");
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
        }
      }
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(2);
    expect(errors[0]).toEqual("AuthRequest.email is required");
    expect(errors[1]).toEqual("AuthRequest.password is required");
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
    expect(errors[0]).toEqual("AuthRequest is required");
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
        }
      }
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(2);
    expect(errors[0]).toEqual("AuthRequest.password should be of type string");
    expect(errors[1]).toEqual("UserDetails.lastName should be of type string");
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
        password: 1234
      }
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(2);
    expect(errors).toContain("AuthRequest.password should be of type string");
    expect(errors).toContain("AuthRequest.userDetails is required");
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
        }
      }
    }));
    expect(resp.statusCode).toEqual(400);
    const errors = resp.getBody().errors;
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(1);
    expect(errors).toContain("UserDetails.firstName is required");
  });
});
