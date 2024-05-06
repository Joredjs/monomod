// Import { IRuta } from '../rutas/rutas.interface';

import { IErrResponse, TResult } from "./result";
import { TFrameworkRequest, TFrameworkResponse } from "./frameworks";

// Import { IJSONObject } from './values';

export interface IAppValidations<TFwReq, TFwRes> {

  manager(
    req: TFrameworkRequest<TFwReq>,
    res: TFrameworkResponse<TFwRes>
  ): TResult<any, IErrResponse>;

}

type THeadersVersion = "v1" | "v2";
interface IHeadersPrefixStructure {
  letter: string;
  prefix: string;
}
export type IHeadersPrefix = {
  [id in THeadersVersion]: IHeadersPrefixStructure;
};

export interface IHeadersStructure {
  desc: string;
  key: string;
  mandatory?: boolean;
  name?: string;
  prefix: IHeadersPrefixStructure;
  private?: boolean;
  values?: string[];
}

export interface IHeadersInfo {
  [id: string]: IHeadersStructure;
}

export interface IHeaderData {
  key: string;
  values: string[];
}

export interface IHeadersValues {
  [id: string]: string;
}
