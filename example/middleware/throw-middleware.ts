import { BeforeMiddlewareHandler, Request, Response, StatusCode } from "../../src";
import { HttpMethod } from "../../dist";

export const responseMiddleware: BeforeMiddlewareHandler = async (request: Request): Promise<[Request, Response<any> | null]> => {
  let response: Response<any> | null = null;
  if (request.method === HttpMethod.GET) {
    response = new Response(StatusCode.unauthorized).setBody({errors: [{ name: "Not Authorised", value: "go away" }]});
  }
  return [request, response];
};
