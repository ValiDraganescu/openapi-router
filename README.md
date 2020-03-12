# openapi-router
A (very opinionated, no dependency) NodeJS Typescript router that implements the OpenAPI 3 spec implemented with the serverless framework in mind.

Early stage development, not to be used in production apps.

[See app implementation example here](https://github.com/ValiDraganescu/openapi-router/blob/master/example/app.ts)

### Router components
* Router
* Validator
* Class and method decorators for OpenAPI 3
* Documentation generator

#### Router
Router is provided as a singleton and can be obtained by calling `getRouter()`. 
The router exposes two methods `handleEvent` and `getApiDoc`.

The `handleEvent` method receives a `Request` parameter (see bellow) that contains
all the information needed to process the request.
```
export class Request<RequestBody = any> {
  headers?: { [key: string]: string };
  path: string;
  method: HttpMethod;
  body?: RequestBody;
  pathParams?: IPathParams | null;
  queryParams?: IQueryParams | null;
  ...
}
```
The `handleEvent` method will search for the correct handler to process the
request.
##### Middleware
The router also supports optional middleware that can execute functions
before and after the original handler (you can add a top level logging 
of the request and response for all handlers for example or alter the 
request or the response)

The `@Route` supports the `middleware` property which in turn has the 
`before` and `after` properties (which are arrays of `BeforeMiddlewareHandler`
and `AfterMiddlewareHandler`)

The `@ApiRouter` supports global middleware. The global before functions will be
executed before each handler's middleware functions. The global after functions
will be executed after each handler's middleware functions. It's good for 
situations where you want to log/persist all the requests and all the responses.  

Example
```typescript

export const beforeAuth: BeforeMiddlewareHandler = async (request:Request<AuthRequest>): Promise<Request> => {
  if (request.body) {
    request.body.email = `before-${request.body.email}`;
  }
  return request;
};

export const afterAuth: AfterMiddlewareRequestHandler = async (response: Response<AuthResponse>): Promise<Response> => {
  if (response.body) {
    const body = response.getBody();
    if (body) {
      body.message = body.message + " after";
      response.setBody(body);
    }
  }
  return response;
};


@Route({
    ...
    middleware: {
      before: [
        beforeAuth
      ],
      after: [
        afterAuth
      ]
    }
   ...
  })
```
[See here a more detailed implementation](https://github.com/ValiDraganescu/openapi-router/blob/master/example/app.ts)

#### Validator
The validator is used to validate the input and output. It is done automatically
and relies on the OpenAPI 3 specs (see implementation, tests and example project).
The validator returns common sense error messages like `AuthRequest.email is required`, 
`UserDetails.lastName should be of type string` etc

#### Decorators
There are two decorators defined `DocMetadata` which defines the documentation
info and global settings and `Route` which registers a method with the router and
defines the behaviour and documentation for a route.

`DocMetadata` example
```typescript
@DocMetadata({
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
  servers: [{
    url: "localhost:8080",
    description: "localhost"
  }, {
    url: "https://dev-api.test.com",
    description: "Development"
  }, {
    url: "https://api.test.com",
    description: "Production"
  }],
  globalResponses: [
    {
      statusCode: 500,
      description: "Internal server error",
      body: ErrorResponse
    }
  ]
})
```
`Route` example
```typescript
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
```

#### Documentation generator
The router also defines the method `getApiDoc` which returns an OpenAPI 3 standard
json documentation based on the `DocMetadata` and `Route`s defined in the API implementation.
The `globalResponses` from the `DocMetadata` can be used to define global responses for all routes.
Think like 404, 401, 500 etc status messages. This responses will be added to any
route that does not already define them.
#### Default headers for all API responses

```json
{
    "Content-Type": "application/json",
    "Cache-Control": "private, max-age=0, no-cache, no-store, must-revalidate'",
    "Expires": "-1",
    "Pragma": "no-cache",
    "Access-Control-Expose-Headers": "X-Api-Version",
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Credentials": "true"
}
```

Can be overridden using one of the following methods
```typescript
  addHeader = (key: string, value: string) => {
    this.headers[key] = value;
  };

  addHeaders = (headers: { [key: string]: string }) => {
    for (const [key, value] of Object.entries(headers)) {
      this.addHeader(key, value);
    }
  };

  setHeaders = (headers: { [key: string]: string }) => {
    this.headers = headers;
  };
``` 
# Licence
![License](https://raw.githubusercontent.com/ValiDraganescu/serverless-log-remover/HEAD/eupl.jpg
)

[Distributed under European Union Public License, version 1.2 (EUPL-1.2)](https://opensource.org/licenses/EUPL-1.2)

