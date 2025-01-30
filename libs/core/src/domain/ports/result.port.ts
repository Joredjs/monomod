import { IErrorMapping, TResultErr, TResultOK } from '../interfaces';

export interface IPortResponseResult {
	resultOk<T>(value?: T): TResultOK<T>;
	resultErr(errInfo: IErrorMapping | unknown): TResultErr;
}
