import { TFrameworkRequest, TFrameworkResponse } from "../interfaces";
import { ITransactionValid } from "./http.port";


export interface IAppValidations<TFwReq, TFwRes> {
	manager(
		req: TFrameworkRequest<TFwReq>,
		res?: TFrameworkResponse<TFwRes>
	): ITransactionValid;
}

