import {Response} from "./response";
import {getRouter, HttpMethod, Request} from "..";
import {APIGatewayEvent} from "aws-lambda";

export abstract class LambdaRouter {

  router = async (event: APIGatewayEvent): Promise<Response> => {
    const request = new Request({
      headers: event.headers,
      path: event.path,
      method: event.httpMethod as HttpMethod,
      body: event.body
    });
    return getRouter().handleEvent(request);
  };
}
