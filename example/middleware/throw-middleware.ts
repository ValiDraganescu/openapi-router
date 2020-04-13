import { BeforeMiddlewareHandler, Request, Response, StatusCode } from "../../src";
import { HttpMethod } from "../../dist";

export const responseMiddleware: BeforeMiddlewareHandler = async (request: Request): Promise<[Request, Response | null]> => {
  let response: Response | null = null;
  if (request.method === HttpMethod.GET) {
    response = new Response(StatusCode.unauthorized).setBody([{ name: "Not Authorised", value: "go away" }]);
  }
  return [request, response];
};
