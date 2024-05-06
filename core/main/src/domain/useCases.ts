import { IErrResponse, IOKResponse } from "./result";
import { ITransactionParams } from "./http";

export interface IUseCase {
	execute(
		info: ITransactionParams
	): Promise<IOKResponse<unknown> | IErrResponse>;
}
