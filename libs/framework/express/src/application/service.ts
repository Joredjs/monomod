import { IExpressResponse, TExpressRes } from '../domain/interface';
import { IFrameworkService } from '@monomod/core/domain';
import { Injectable } from '@monomod/core/application';

// TODO: add response error

export class ExpressService implements IFrameworkService<TExpressRes> {
	public returnInfo(resInfo: IExpressResponse): void {
		resInfo.resInstance.status(resInfo.status).send(resInfo.resBody);
	}
}
