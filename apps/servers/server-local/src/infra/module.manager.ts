import { DIContainer, ModuleBase } from '@monomod/core/application';
import { ModuleCore } from '@monomod/core/infra';
import { ModuleExpress } from '@monomod/framework-express/infra';
import { ModuleServer } from './server.module';

export class ModuleManager {
	static #registeredModules = new Set<string>();

	static #modules: {
		instance: typeof ModuleBase;
	}[] = [
		{ instance: ModuleCore },
		{ instance: ModuleExpress },
		{ instance: ModuleServer },
	];

	static initialize(): DIContainer {
		const container = DIContainer.getInstance();

		this.#modules.forEach((ModuleClass) => {
			this.#registerModuleOnce(ModuleClass.instance.name, () =>
				ModuleClass.instance.register(container)
			);
		});

		return container;
	}

	static #registerModuleOnce(moduleName: string, registerFn: () => void) {
		if (!this.#registeredModules.has(moduleName)) {
			registerFn();
			this.#registeredModules.add(moduleName);
		}
	}
}
