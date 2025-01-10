import { DIContainer, ModuleBase, ServiceI18n } from '../application';
import { TOKENS } from '../domain';

export class ModuleCore extends ModuleBase {
	static components = [
		{ token: TOKENS.services.IServiceI18n, value: ServiceI18n },
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
