import {
	IErrResponse,
	IOKResponse,
	IPortParams,
	ITransactionParams,
	TDomainGroups,
} from '.';

export interface IUseCase {
	execute(
		info?: ITransactionParams
	): Promise<IOKResponse<unknown> | IErrResponse>;
}

export interface IAllUseCases {
	[useCase: string]: IUseCase;
}

export type TExternalUseCases = {
	[index in TDomainGroups]?: IAllUseCases;
};

export interface IUseCaseParams<TRepository> extends IPortParams {
	repository?: TRepository;
}
