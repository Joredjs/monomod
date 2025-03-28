import {
	IContainerComponent,
	IContainerParameters,
	IPortContainer,
	IPortContainerAnalyzer,
	IPortContainerRegistry,
} from '../../domain';
import { ContainerAnalyzer } from './analyzer';
import { ContainerRegistry } from './registry';

export class DIContainer implements IPortContainer {
	static #instance;

	#parameters: IContainerParameters;

	#initializationComplete = false;

	readonly #analizer: IPortContainerAnalyzer;

	readonly #registry: IPortContainerRegistry;

	#debugContainer = false;

	constructor() {
		this.#parameters = {
			constants: new Map(),
			dependencies: new Map(),
			instances: new Map(),
			lazyResolutions: new Map(),
			resolutionStack: new Set(),
		};
		// TODO: Take this from configuration file
		this.#analizer = new ContainerAnalyzer(this.#debugContainer);
		this.#registry = new ContainerRegistry(this.#analizer);
	}

	static getInstance(): DIContainer {
		if (!DIContainer.#instance) {
			DIContainer.#instance = new DIContainer();
		}
		return DIContainer.#instance;
	}

	register(component: IContainerComponent) {
		this.#parameters = this.#registry.register(this.#parameters, component);
	}

	resolve<T>(token: symbol): T {
		const resolved = this.#registry.resolve<T>(
			this.#parameters,
			token,
			this.#initializationComplete
		);
		this.#parameters = resolved.parameters;
		return resolved.instance;
	}

	hasRegistration(token: symbol): boolean {
		return (
			this.#parameters.dependencies.has(token) ||
			this.#parameters.constants.has(token)
		);
	}

	clear(): void {
		this.#parameters.dependencies.clear();
		this.#parameters.instances.clear();
		this.#parameters.constants.clear();
	}

	complete(token: symbol): void {
		this.#initializationComplete = true;
		this.#analizer.analyze(this.#parameters);
		this.#analizer.resolutionGraph(this.#parameters, token);
	}
}
