import {
	IPortContainer,
	IPortRegistry,
	IPortServerRegister,
} from '@monomod/core/domain';
import { DIContainer } from '@monomod/core/application';
import { RegistryExpress } from '@monomod/framework-express/infra';
import { RegistryServerLocal } from './local.server.registry';

export class ProjectRegisterServerLocal implements IPortServerRegister {
	readonly #registeredProjects = new Set<string>();

	readonly #container: IPortContainer;

	readonly #projects: IPortRegistry[];

	constructor() {
		this.#container = DIContainer.getInstance();
		this.#projects = [
			new RegistryExpress(),
			new RegistryServerLocal(),
		];
	}

	initialize(): IPortContainer {
		this.#projects.forEach(this.#registerProjectOnce.bind(this));
		return this.#container;
	}

	#registerProjectOnce(project: IPortRegistry) {
		const projectName = project.getName();
		if (!this.#registeredProjects.has(projectName)) {
			project.registerDependency(this.#container);
			this.#registeredProjects.add(projectName);
		}
	}
}
