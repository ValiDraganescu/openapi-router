import {RouterMetadata} from "./router-metadata";


const getGlobal = (): any => {
  return global;
};

export const getMetadataStorage = (): RouterMetadata => {
  const global = getGlobal();
  if (!global.routerMetadata) {
    global.routerMetadata = new RouterMetadata();
  }
  return global.routerMetadata;
};
