import { IErrResponse, IOKResponse } from "./result";
import { IAppServices } from "./layers";
import { IJSONObject } from "./values";
import { IRuta } from "./rutas";
import { IncomingHttpHeaders } from "http2";

export type THttpMethods = "get" | "post" | "delete" | "put";

export enum EHttpMethods {
  "GET" = "get",
  "POST" = "post",
  "PUT" = "put",
  "DELETE" = "delete",
}

export interface ITransactionParams {
  bodyParams?: IJSONObject;
  reqHeader?: IncomingHttpHeaders;
  ruta?: IRuta;
}

export interface ITransactionValid extends ITransactionParams {
  useCase: (
    info: ITransactionParams
  ) => Promise<IOKResponse<any> | IErrResponse>;
  appServices?: IAppServices;
}
