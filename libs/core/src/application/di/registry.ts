import 'reflect-metadata';
import {
	IContainerComponent,
	IContainerInstaceParams,
	IContainerParameters,
	IPortContainerAnalyzer,
	IPortContainerRegistry,
} from '../../domain';
import {
	INJECT_METADATA_KEY,
	PROVIDER_METADATA_KEY,
	PropertyMetadata,
} from './metadata';

export class ContainerRegistry implements IPortContainerRegistry {
	readonly #analizer: IPortContainerAnalyzer;

	constructor(analizer: IPortContainerAnalyzer) {
		this.#analizer = analizer;
	}

	#registerConstant(
		parameters: IContainerParameters,
		component: IContainerComponent
	): IContainerParameters {
		if (parameters.constants.has(component.token)) {
			throw new Error(
				`Constant ${component.token.toString()} already registered`
			);
		}
		parameters.constants.set(component.token, component.value);

		return parameters;
	}

	#registerDependency(
		parameters: IContainerParameters,
		component: IContainerComponent
	): IContainerParameters {
		const { token, value: implementation } = component;
		// Const implementation = component.value;
		if (parameters.dependencies.has(token)) {
			const existing = parameters.dependencies.get(token);

			if (existing) {
				if (existing !== implementation) {
					throw new Error(
						`Token ${token.toString()} already has a different implementation`
					);
				}
				throw new Error(`Already registered ${token.toString()}`);
			}
			// Return {};
		}
		parameters.dependencies.set(token, implementation);

		if (typeof implementation === 'function' && implementation.prototype) {
			Reflect.defineMetadata(
				PROVIDER_METADATA_KEY,
				{ implementation, token },
				implementation
			);
		}

		return parameters;
	}

	register(
		parameters: IContainerParameters,
		component: IContainerComponent
	): IContainerParameters {
		this.#analizer.register(component);

		if (component.isConstant) {
			return this.#registerConstant(parameters, component);
		}

		return this.#registerDependency(parameters, component);
	}

	#createInstance<T>(
		parameters: IContainerParameters,
		Implementation: new (...args: any[]) => T,
		isCompleted: boolean
	): T {
		const constructorParams =
			Reflect.getMetadata('design:paramtypes', Implementation) || [];

		const injections = constructorParams.map(
			(param: any) => this.resolve(parameters, param, isCompleted).instance
		);
		const instance = new Implementation(...injections);

		const propertyMetadata: PropertyMetadata[] =
			Reflect.getMetadata(INJECT_METADATA_KEY, Implementation.prototype) || [];

		propertyMetadata.forEach((metadata) => {
			Object.defineProperty(instance, metadata.propertyKey, {
				configurable: false,
				enumerable: true,
				get: () =>
					this.resolve(parameters, metadata.token, isCompleted).instance,
			});
		});

		return instance;
	}

	#handleDependenciesResolve<T>(
		token: symbol,
		parameters: IContainerParameters,
		isCompleted: boolean
	): IContainerInstaceParams<T> {
		// Si encontramos una implementación registrada para el token (Symbol)
		if (parameters.dependencies.has(token)) {
			const Implementation = parameters.dependencies.get(token);

			if (!Implementation) {
				throw new Error(`No provider found for ${String(token)}`);
			}

			// Si la implementación es una clase, la instanciamos
			if (typeof Implementation === 'function' && Implementation.prototype) {
				const instance = this.#createInstance(
					parameters,
					Implementation,
					isCompleted
				) as T;
				parameters.instances.set(token, instance);
				return { instance, parameters };
			}
			return { instance: Implementation, parameters };
		}

		throw new Error(`No provider found for ${String(token)}`);
	}

	#handleResolve<T>(
		parameters: IContainerParameters,
		token: symbol,
		isCompleted: boolean
	): IContainerInstaceParams<T> {
		if (parameters.instances.has(token)) {
			return { instance: parameters.instances.get(token) as T, parameters };
		}

		if (parameters.constants.has(token)) {
			return { instance: parameters.constants.get(token) as T, parameters };
		}
		return this.#handleDependenciesResolve<T>(token, parameters, isCompleted);
	}

	#handleResolutions(
		parameters: IContainerParameters,
		token: symbol,
		isCompleted: boolean
	): IContainerParameters {
		if (parameters.resolutionStack.has(token)) {
			const path = Array.from(parameters.resolutionStack)
				.map((route) => route.toString())
				.join(' -> ');
			throw new Error(
				`Circular dependency detected for ${token.toString()}. Path: ${path} -> ${token.toString()}`
			);
		}

		if (
			isCompleted &&
			!parameters.instances.has(token) &&
			!parameters.constants.has(token)
		) {
			parameters.lazyResolutions.set(token, {
				stack:
					new Error().stack?.split('\n').slice(2).join('\n') || 'Unknown stack',
				time: Date.now(),
			});
		}

		parameters.resolutionStack.add(token);

		return parameters;
	}

	resolve<T>(
		parameters: IContainerParameters,
		token: symbol,
		isCompleted: boolean
	): IContainerInstaceParams<T> {
		this.#analizer.resolve(parameters, token, isCompleted);

		parameters = this.#handleResolutions(parameters, token, isCompleted);
		try {
			return this.#handleResolve(parameters, token, isCompleted);
		} finally {
			parameters.resolutionStack.delete(token);
		}
	}
}
