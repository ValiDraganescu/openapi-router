import {getMetadataStorage} from "../../metadata/metadata-storage";
import {MethodMetadata, ResponseMetadata, RouteMetadata} from "../../metadata/router-metadata";
import {ObjectType} from "../../object-type";
import {HttpMethod} from "../../doc/http-method";
import {DocParameter} from "../../doc/model/parameter";

export interface IRouteProps {
  method: HttpMethod;
  path: string;
  description: string;
  responses: ResponseMetadata[];
  requestBody?: ObjectType<any>;
  summary?: string;
  parameters?: DocParameter[];
  security?: any[];
}

export const Route = (props: IRouteProps) => {
  return (target: any, propertyKey: string) => {
    const metadata = getMetadataStorage();
    const routeMeta = new RouteMetadata(target[propertyKey])
      .setResponses(props.responses)
      .setRequestBody(props.requestBody);
    routeMeta.description = props.description;
    routeMeta.summary = props.summary;
    routeMeta.parameters = props.parameters;
    routeMeta.security = props.security;

    let methodMetadata;

    if (metadata.paths.has(props.path)) {
      methodMetadata = metadata.paths.get(props.path);
    } else {
      methodMetadata = new MethodMetadata();
    }
    if (methodMetadata) {
      methodMetadata[props.method] = routeMeta;
      metadata.paths.set(props.path, methodMetadata);
    }
  };
};
