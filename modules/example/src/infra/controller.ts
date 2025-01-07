import { BaseController } from '@monomod/core/infra';
import { IController } from '@monomod/core/domain';

export class ModuleExampleController<TFwReq, TFwRes>
	extends BaseController<TFwReq, TFwRes>
	implements IController<TFwReq, TFwRes> {}
