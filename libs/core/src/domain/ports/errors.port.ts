import { IErrResponse, IErrorMapping } from '../interfaces';

export interface IPortErrors {
	normalize(errInfo: IErrorMapping): IErrorMapping | IErrResponse;
	isIErrResponse(errInfo: unknown): errInfo is IErrResponse;
	isIErrorMapping(errInfo: unknown): errInfo is IErrorMapping;
}
