import { AuthRequest } from "../model/request/auth-request";
import { AfterMiddlewareHandler, BeforeMiddlewareHandler, Request, Response } from "../../src";
import { AuthResponse } from "../model/response/auth-response";

export const beforeAuth: BeforeMiddlewareHandler = async (request: Request<AuthRequest>): Promise<Request> => {
  if (request.body) {
    request.body.email = `before-${request.body.email}`;
  }
  return request;
};

export const afterAuth: AfterMiddlewareHandler = async (response: Response<AuthResponse>): Promise<Response> => {
  if (response.body) {
    const body = response.body?.data;
    if (body) {
      body.message = body.message + " after";
      response.setData(body);
    }
  }
  return response;
};
