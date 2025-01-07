import { IErrResponse, IOKResponse } from '../result';
import { IPortParams } from '../layers';
import { ITransactionParams } from '../http';
import { TDomainGroups } from '../modules';

export interface IUseCase<TResponse> {
	execute(
		info?: ITransactionParams
	): Promise<IErrResponse | IOKResponse<TResponse>>;
}

export interface IAllUseCases {
	[useCase: string]: IUseCase<unknown>;
}

export type TExternalUseCases = {
	[index in TDomainGroups]?: IAllUseCases;
};

export interface IUseCaseParams<TRepository> extends IPortParams {
	repository?: TRepository;
}

export interface IExternalUseCaseParams {
	info: ITransactionParams;
	useCasesGroup?: IAllUseCases;
	useCase: string;
	errorMsg: string;
}
export interface IServiceUseCase {
	requestExternal<TGReturn>(params: IExternalUseCaseParams): Promise<TGReturn>;
}
