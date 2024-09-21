import {
	IController,
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IServicesDependencies,
	TControllers,
} from '@nxms/core/domain';
import { AppValidations } from '../application';
import { ExampleController } from '@nxms/module-example/infra';

export class AdapterControllers<
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#framework: IFrameworkService<TFwRes>;

	constructor(frameworkService: IFrameworkService<TFwRes>) {
		this.#framework = frameworkService;
	}

	getAll(dependencies: IServicesDependencies): TControllers<TFwReq, TFwRes> {
		const appValidations = new AppValidations<TFwReq, TFwRes>(dependencies);

		const example = this.#getExample(appValidations);

		return { example };
	}

	#getExample(validations): IController<TFwReq, TFwRes> {
		return new ExampleController<TFwReq, TFwRes>(validations, this.#framework);
	}
}
