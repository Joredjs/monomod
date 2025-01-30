import {
	IHeadersValues,
	ITransactionParams,
	TIncomingHttpHeaders,
} from '../interfaces';
import { IDefaultToken } from '../const';

export interface IServiceHeader {
	validateToken<IToken extends IDefaultToken>(info: ITransactionParams): IToken;
	validateMandatory(headersReq: TIncomingHttpHeaders): boolean;
	validate(headersReq: TIncomingHttpHeaders, key?: string): boolean;
	validateRouteHeaders(info: ITransactionParams): IHeadersValues;
}
