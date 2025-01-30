import { IErrResponse, IOKResponse, ITransactionParams } from '../interfaces';
import { IUseCaseParams } from './useCases.port';

export interface ITransactionValid extends ITransactionParams {
	handler: (
		info?: ITransactionParams
	) => Promise<IOKResponse<unknown> | IErrResponse>;
	usecaseParams?: IUseCaseParams<unknown>;
}
