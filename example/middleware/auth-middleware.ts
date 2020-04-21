import { AuthRequest } from "../model/request/auth-request";
import { AfterMiddlewareHandler, BeforeMiddlewareHandler, Request, Response } from "../../src";
import { AuthResponse } from "../model/response/auth-response";

export const beforeAuth: BeforeMiddlewareHandler = async (request: Request<AuthRequest>): Promise<[Request, Response | null]> => {
  if (request.body) {
    request.body.email = `before-${request.body.email}`;
  }
  return [request, null];
};

export const afterAuth: AfterMiddlewareHandler = async (response: Response<AuthResponse>): Promise<Response> => {
  if (response) {
    const body = response.getBody();
    if (body) {
      body.data.message = body.data.message + " after";
      response.setBody(body);
    }
  }
  return response;
};
