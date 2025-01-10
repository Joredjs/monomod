import { DIContainer, ModuleBase } from '@monomod/core/application';
import { ExpressDebug, ExpressFactory, ExpressService } from '../application';
import { AdapterExpress } from '.';
import { TOKENS } from '@monomod/core/domain';

export class ModuleExpress extends ModuleBase {
	static components = [
		{ token: TOKENS.framework.IExpressAdapter, value: AdapterExpress },
		{ token: TOKENS.framework.IExpressFactory, value: ExpressFactory },
		{ token: TOKENS.framework.IExpressDebug, value: ExpressDebug },
		{ token: TOKENS.framework.IExpressService, value: ExpressService },
	];

	static register(container: DIContainer) {
		this.components.forEach((component) => {
			if (!container.hasRegistration(component.token)) {
				container.register(component.token, component.value);
			}
		});
		return container;
	}
}
