import { IExpressResponse, TExpressRes } from './interface';
import { IFrameworkService } from '@nxms/core/domain';

export class ExpressService implements IFrameworkService<TExpressRes> {
	public returnInfo(resInfo: IExpressResponse): void {
		resInfo.resInstance.status(resInfo.status).send(resInfo.resBody);
	}
}
