import { BaseController } from '@nxms/core/infra';
import { IController } from '@nxms/core/domain';

export class ExampleController<TFwReq, TFwRes>
	extends BaseController<TFwReq, TFwRes>
	implements IController<TFwReq, TFwRes> {}
