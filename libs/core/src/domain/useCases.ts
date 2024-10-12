import { IErrResponse, IOKResponse } from './result';
import { IPortParams } from './layers';
import { ITransactionParams } from './http';
import { TDomainGroups } from './route';

export interface IUseCase {
	execute(info?: ITransactionParams): Promise<IErrResponse | IOKResponse<any>>;
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

export interface IExternalUseCaseParams {
	info: ITransactionParams;
	useCasesGroup: IAllUseCases;
	useCase: string;
	errorMsg: string;
}
