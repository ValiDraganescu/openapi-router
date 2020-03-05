import { AfterMiddlewareRequestHandler, BeforeMiddlewareHandler } from "../../src/router/request-handler";
import { AuthRequest } from "../model/request/auth-request";
import {Request, Response} from "../../src";
import { AuthResponse } from "../model/response/auth-response";

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
