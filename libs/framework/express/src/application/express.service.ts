import { IExpressResponse, TExpressRes } from '../domain/express.interface';
import { IPortFrameworkService, SYMBOLS } from '@monomod/core/domain';
import { Injectable } from '@monomod/core/application';

// TODO: add response error

@Injectable(SYMBOLS.framework.IFrameworkService)
export class ExpressService implements IPortFrameworkService<TExpressRes> {
	returnInfo(resInfo: IExpressResponse): void {
		resInfo.resInstance.status(resInfo.status).send(resInfo.resBody);
	}
}
