import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { HttpMethod, Router } from "..";
import { Request } from "./request";

const paramsToObject = (params: URLSearchParams) => {
  const result: any = {};
  params.forEach((value: string, key: string) => {
    result[key] = value;
  });
  return result;
};

const getRequestFromEvent = (request: IncomingMessage, parsedBody: any, rawBody: string): Request => {
  const headers: any = request.headers;
  const method = request.method as HttpMethod;
  const urlString = `${headers.host}${request.url}`;
  const url = new URL(urlString);
  const path = url.pathname.replace("8080", "");
  const queryParams = paramsToObject(url.searchParams);

  const routerRequest = new Request({
    headers,
    path,
    method,
    body: parsedBody,
    rawBody,
    queryParams,
  });
  console.log("Router request", routerRequest);
  return routerRequest;
};

export class DevServer {
  private server: Server;
  private router: Router;

  constructor(router: Router, private port = 8080) {
    this.router = router;
  }

  onRequest = async (request: IncomingMessage, response: ServerResponse) => {
    let data = "";
    request.on("data", chunk => {
      data += chunk;
    });
    request.on("end", async () => {
      let parsedBody: any;
      if (data) {
        try {
          parsedBody = JSON.parse(data);
        } catch (e) {
          response.statusCode = 400;
          response.end({
            errors: [
              {
                code: "1",
                message: e.message,
              },
            ],
          });
        }
      }

      const routerRequest = getRequestFromEvent(request, parsedBody, data);
      if (request.method?.toUpperCase() === HttpMethod.OPTIONS) {
        response.setHeader("Access-Control-Expose-Headers", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Allow-Methods", "*");
        response.setHeader("Connection", "keep-alive");
        response.setHeader("Access-Control-Request-Method", "POST");
        response.setHeader("Allow", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
        response.setHeader("Allowed", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
        response.writeHead(200);
        return response.end();
      }

      try {
        const result = await this.router.handleEvent(routerRequest);
        response.writeHead(result.statusCode, result.headers);
        response.end(result.body);
      } catch (e) {
        response.statusCode = 500;
        response.end({
          errors: [
            {
              code: "1",
              message: e.message,
            },
          ],
        });
      }
      return;
    });
  };

  start() {
    this.server = createServer(this.onRequest)
      .listen(this.port)
      .on("listening", () => {
        console.log(`Server started: http://localhost:${this.port}`);
      })
      .on("close", () => {
        console.log("Server closed");
      })
      .on("error", (err: Error) => {
        console.log("Server error");
        console.error(err);
      })
      .on("connection", () => {
        console.log("Received connection");
      });
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }
}
