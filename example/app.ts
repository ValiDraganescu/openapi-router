import { ApiRouter, getRouter, HttpMethod, LambdaRouter, Request, Response, Route } from "../src";
import { HelloResponse } from "./model/response/hello-response";
import { AuthResponse } from "./model/response/auth-response";
import { AuthRequest } from "./model/request/auth-request";
import { afterAuth, beforeAuth } from "./middleware/auth-middleware";

@ApiRouter({
  version: "1.0.0",
  title: "A test app",
  description: "Exactly as the name suggests",
  contact: {
    name: "Vali Draganescu",
    email: "vali.draganescu88@gmail.com",
    url: "https://technoloid.com"
  },
  termsOfService: "https://technoloid.com/terms",
  license: {
    name: "DWETFYW | Do what ever the fuck you want",
    url: "https://technoloid.com/license"
  },
  securitySchemes: {
    ApiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "X-API-Key"
    },
    BearerAuth: {
      type: "http",
      scheme: "bearer"
    }
  },
  security: [
    {
      ApiKeyAuth: []
    },
    {
      BearerAuth: []
    }
  ],
  servers: [
    {
      url: "localhost:8080",
      description: "localhost"
    }, {
      url: "https://dev-api.test.com",
      description: "Development"
    }, {
      url: "https://api.test.com",
      description: "Production"
    }]
})
export class App extends LambdaRouter {

  @Route({
    description: "simple method, just says hello to the user",
    summary: "This is the summary",
    method: HttpMethod.GET,
    path: "/hello",
    responses: [{
      statusCode: 200,
      description: "hello response",
      body: HelloResponse
    }]
  })
  async sayHelloHandler(_request: Request): Promise<Response<HelloResponse>> {
    return new Response<HelloResponse>().setData({ message: "hello" });
  };

  @Route({
    description: "returns the doc for this API",
    method: HttpMethod.GET,
    path: "/api/doc",
    responses: [{
      description: "Returns the OpenApi json for this API",
      statusCode: 200
    }]
  })
  async getApiDoc(_request: Request): Promise<Response<HelloResponse>> {
    return new Response<HelloResponse>().setData(getRouter().getApiDoc("3.0.0"));
  };

  @Route({
    description: "says hello, but with POST method",
    method: HttpMethod.POST,
    path: "/hello",
    responses: [{
      description: "mock",
      statusCode: 200,
      body: HelloResponse
    }]
  })
  async sayHelloWithPostHandler(_request: Request): Promise<Response<HelloResponse>> {
    return new Response<HelloResponse>().setData({ message: "hello with POST" });
  }

  @Route({
    description: "It's like simple hello, but with some extra foo",
    method: HttpMethod.GET,
    path: "/hello/foo",
    responses: [{
      description: "mock",
      statusCode: 200,
      body: HelloResponse
    }]
  })
  async sayHelloFooHandler(_request: Request): Promise<Response<HelloResponse>> {
    return new Response<HelloResponse>().setData({ message: "hello foo" });
  }

  @Route({
    description: "Basically a complicated form of hello, this time with some parameters",
    method: HttpMethod.GET,
    path: "/hello/{organization}/{team}/{name}",
    responses: [{
      description: "mock",
      statusCode: 200,
      body: HelloResponse
    }],
    parameters: [{
      description: "The user organization",
      in: "path",
      name: "organization",
      required: true,
      schema: {
        type: "string"
      }
    }, {
      description: "The user team",
      in: "path",
      name: "team",
      required: true,
      schema: {
        type: "string"
      }
    }, {
      description: "The user name",
      in: "path",
      name: "name",
      required: true,
      schema: {
        type: "string"
      }
    }]
  })
  async sayHelloFooNameHandler(request: Request): Promise<Response<HelloResponse>> {
    const name = request.pathParams?.name.value;
    const org = request.pathParams?.organization.value;
    const team = request.pathParams?.team.value;
    return new Response<HelloResponse>().setData({ message: `hello ${name} from ${team} team of ${org}` });
  }

  @Route({
    description: "Post method with body",
    summary: "A POST method with request and response bodies",
    method: HttpMethod.POST,
    path: "/auth",
    requestBody: AuthRequest,
    responses: [{
      statusCode: 200,
      description: "mock",
      body: AuthResponse
    }],
    security: [{
      ApiKeyAuth: []
    }]
  })
  async authHandler(request: Request<AuthRequest>): Promise<Response<AuthResponse>> {
    return new Response<AuthResponse>().setData({
      message: `Auth email address is ${request.body?.email} and password is ${request.body?.password}`
    });
  }

  @Route({
    description: "Post method with body and before middleware",
    summary: "A POST method with request and response bodies",
    method: HttpMethod.POST,
    path: "/auth-before",
    requestBody: AuthRequest,
    responses: [{
      statusCode: 200,
      description: "mock",
      body: AuthResponse
    }],
    security: [{
      ApiKeyAuth: []
    }],
    middleware: {
      before: [
        beforeAuth
      ]
    }
  })
  async authBeforeHandler(request: Request<AuthRequest>): Promise<Response<AuthResponse>> {
    return new Response<AuthResponse>().setData({
      message: `Auth email address is ${request.body?.email} and password is ${request.body?.password}`
    });
  }

  @Route({
    description: "Post method with body and after middleware",
    summary: "A POST method with request and response bodies",
    method: HttpMethod.POST,
    path: "/auth-after",
    requestBody: AuthRequest,
    responses: [{
      statusCode: 200,
      description: "mock",
      body: AuthResponse
    }],
    security: [{
      ApiKeyAuth: []
    }],
    middleware: {
      after: [
        afterAuth
      ]
    }
  })
  async authAfterHandler(request: Request<AuthRequest>): Promise<Response<AuthResponse>> {
    return new Response<AuthResponse>().setData({
      message: `Auth email address is ${request.body?.email} and password is ${request.body?.password}`
    });
  }

  @Route({
    description: "Post method with body and before, after middleware",
    summary: "A POST method with request and response bodies",
    method: HttpMethod.POST,
    path: "/auth-before-and-after",
    requestBody: AuthRequest,
    responses: [{
      statusCode: 200,
      description: "mock",
      body: AuthResponse
    }],
    security: [{
      ApiKeyAuth: []
    }],
    middleware: {
      before: [
        beforeAuth
      ],
      after: [
        afterAuth
      ]
    }
  })
  async authBeforeAfterHandler(request: Request<AuthRequest>): Promise<Response<AuthResponse>> {
    return new Response<AuthResponse>().setData({
      message: `Auth email address is ${request.body?.email} and password is ${request.body?.password}`
    });
  }

  @Route({
    description: "A method with DELETE",
    method: HttpMethod.DELETE,
    path: "/users/{id}",
    responses: [{
      description: "mock",
      statusCode: 204
    }],
    parameters: [{
      description: "The user id",
      in: "path",
      name: "id",
      required: true,
      schema: {
        type: "number"
      }
    }]
  })
  async deleteUser(_request: Request): Promise<Response> {
    console.log("Delete user");
    return new Response(204);
  }

  @Route({
    description: "A method with PUT",
    method: HttpMethod.PUT,
    path: "/users/{id}",
    responses: [{
      description: "mock",
      statusCode: 200
    }],
    parameters: [{
      description: "The user id",
      in: "path",
      name: "id",
      required: true,
      schema: {
        type: "number"
      }
    }]
  })
  async updateUser(request: Request): Promise<Response> {
    console.log("Update user");
    return new Response(200).setData(request.body);
  }

  @Route({
    description: "A POST method with url params",
    method: HttpMethod.POST,
    path: "/auth/{userType}",
    requestBody: AuthRequest,
    responses: [{
      statusCode: 200,
      description: "mock",
      body: AuthResponse
    }],
    parameters: [{
      description: "The user type",
      in: "path",
      name: "userType",
      required: true,
      schema: {
        type: "string",
        enum: [
          "admin",
          "user"
        ]
      }
    }]
  })
  async authAdminHandler(request: Request<AuthRequest>): Promise<Response<AuthResponse>> {
    return new Response<AuthResponse>().setData({
      message: `Auth email address is ${request.body?.email} and password is ${request.body?.password}, logging in as ${request.pathParams?.userType.value}`
    });
  }

  consumeEvent = async (event: Request): Promise<Response<any>> => {
    return getRouter().handleEvent(event);
  };
}


