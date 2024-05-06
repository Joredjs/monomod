import { BaseController } from '@nxms/core-main/infra';
import { IController } from '@nxms/core-main/domain';

export class ExampleController<TFwReq, TFwRes>
	extends BaseController<TFwReq, TFwRes>
	implements IController<TFwReq, TFwRes> {}

