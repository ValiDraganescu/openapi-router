
import {DocInfo} from "./info";
import {DocServer} from "./server";
import {DocPath} from "./paths";
import {DocComponents} from "./compoents";

export class DocApi {
  openapi: string = "3.0.0";
  info: DocInfo;
  servers: DocServer[];
  paths: {[key: string]: DocPath};
  components: DocComponents;
  security?: {[key: string]: any[]}[];
}
