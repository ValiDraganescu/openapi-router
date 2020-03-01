import {DocMethod} from "./method";
import {Updatable} from "../../updatable";

export class DocPath extends Updatable {
  [key: string]: DocMethod | any;
}
