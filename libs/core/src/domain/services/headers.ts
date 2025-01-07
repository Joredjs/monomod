import { ITransactionParams, TIncomingHttpHeaders } from "../http";
import { IDefaultToken } from "../modules";
import { IHeadersValues } from "../validations";

export interface IServiceHeader {
	validateToken<IToken extends IDefaultToken>(info: ITransactionParams): IToken;
	validateMandatory(headersReq: TIncomingHttpHeaders): boolean;
	validate(headersReq: TIncomingHttpHeaders, key?: string): boolean;
	validateRouteHeaders(info: ITransactionParams): IHeadersValues;
}
