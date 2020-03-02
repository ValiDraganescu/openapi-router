# openapi-router
A (very opinionated, no dependency) NodeJS Typescript router that implements the OpenAPI 3 spec implemented with the serverless framework in mind.

Early stage development, not to be used in production apps.

[See app implementation example here](https://github.com/ValiDraganescu/openapi-router/blob/master/example/app.ts)

###Router components
* Router
* Validator
* Class and method decorators for OpenAPI 3
* Documentation generator

####Router
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

####Validator
The validator is used to validate the input and output. It is done automatically
and relies on the OpenAPI 3 specs (see implementation, tests and example project).
The validator returns common sense error messages like `AuthRequest.email is required`, 
`UserDetails.lastName should be of type string` etc

####Decorators
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
  }]
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

####Documentation generator
The router also defines the method `getApiDoc` which returns an OpenAPI 3 standard
json documentation based on the `DocMetadata` and `Route`s defined in the API implementation.

#Licence
![License](https://raw.githubusercontent.com/ValiDraganescu/serverless-log-remover/HEAD/eupl.jpg
)

[Distributed under European Union Public License, version 1.2 (EUPL-1.2)](https://opensource.org/licenses/EUPL-1.2)

