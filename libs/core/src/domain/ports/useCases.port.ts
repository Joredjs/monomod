import { IErrResponse, IOKResponse, ITransactionParams } from '../interfaces';
import { IPortParams } from './layers.port';
import { TDomainGroups } from '../const';

export interface IUseCaseParams<TRepository> extends IPortParams {
	repository?: TRepository;
}

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

export interface IExternalUseCaseParams {
	info: ITransactionParams;
	useCasesGroup?: IAllUseCases;
	useCase: string;
	errorMsg: string;
}
export interface IServiceUseCase {
	requestExternal<TGReturn>(params: IExternalUseCaseParams): Promise<TGReturn>;
}
