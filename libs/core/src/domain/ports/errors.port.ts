import { IErrResponse, IErrorMapping } from '../interfaces';

export interface IPortErrors {
	handle(errInfo: IErrorMapping): never;
	isIErrResponse(errInfo: unknown): errInfo is IErrResponse;
	isIErrorMapping(errInfo: unknown): errInfo is IErrorMapping;
}
