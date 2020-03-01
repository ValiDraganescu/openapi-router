import {getMetadataStorage} from "../../metadata/metadata-storage";
import {PropertyMetadata} from "../../metadata/router-metadata";
import {DocInfo} from "../model/info";

export const DocProperty = (props: PropertyMetadata) => {
  return (target: any, propertyKey: string) => {
    const metadata = getMetadataStorage();
    if (!metadata.entities[target.constructor.name]) {
      metadata.entities[target.constructor.name] = {};
    }

    if (props) {
      metadata.entities[target.constructor.name][propertyKey] = props;
    }
  };
};


export const DocMetadata = (opts: DocInfo) => {
  return (_target: any) => {
    const metadata = getMetadataStorage();
    metadata.docMetadata = opts;
  };
};
