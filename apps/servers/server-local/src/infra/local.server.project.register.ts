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
			// New RegistryCore(),
			new RegistryExpress(),
			new RegistryServerLocal(),
		];
	}

	initialize(): IPortContainer {
		/* This.#projects.forEach((project) => {
		   	this.#registerProjectOnce(project);
		   }); */
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
