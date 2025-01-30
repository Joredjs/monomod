import { IExpressResponse, TExpressRes } from '../domain/express.interface';
import { IPortFrameworkService, TOKENS } from '@monomod/core/domain';
import { Injectable } from '@monomod/core/application';

// TODO: add response error

@Injectable(TOKENS.framework.IFrameworkService)
export class ExpressService implements IPortFrameworkService<TExpressRes> {
	returnInfo(resInfo: IExpressResponse): void {
		resInfo.resInstance.status(resInfo.status).send(resInfo.resBody);
	}
}
