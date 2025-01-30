import 'reflect-metadata';
import { IContainerComponent, IPortContainer } from '../../domain';
import { INJECT_METADATA_KEY, PropertyMetadata } from './metadata';

// Container.ts
export class DIContainer implements IPortContainer {
	static #instance;

	#dependencies: Map<symbol, any> = new Map();

	#instances: Map<symbol, any> = new Map();

	#constants: Map<symbol, any> = new Map();

	static getInstance(): DIContainer {
		if (!DIContainer.#instance) {
			DIContainer.#instance = new DIContainer();
		}
		return DIContainer.#instance;
	}

	register(component: IContainerComponent) {
		console.debug('Registering:', component);
		if (component.isConstant) {
			this.#constants.set(component.token, component.value);
			return;
		}

		const existing = this.#dependencies.get(component.token);

		if (existing && existing !== component.value) {
			throw new Error(
				`Token ${component.token.toString()} already has a different implementation registered`
			);
		}

		if (existing) {
			throw new Error(`Already registered ${component.token.toString()}`);
		} else {
			this.#dependencies.set(component.token, component.value);
			// Console.debug('registering', token);
		}

		console.debug('dependencies', this.#dependencies);
		console.debug('instances', this.#instances);
		console.debug('constants', this.#constants);
	}

	#createInstance<T>(Implementation: new (...args: any[]) => T): T {
		const constructorParams =
			Reflect.getMetadata('design:paramtypes', Implementation) || [];

		// Console.log('PARAMS', constructorParams);
		const injections = constructorParams.map((param: any) =>
			this.resolve(param)
		);
		const instance = new Implementation(...injections);

		const propertyMetadata: PropertyMetadata[] =
			Reflect.getMetadata(INJECT_METADATA_KEY, Implementation.prototype) || [];

		// Console.log('METADATA', propertyMetadata);
		propertyMetadata.forEach((metadata) => {
			// Console.log('WILL RESOLVE', metadata.token);
			Object.defineProperty(instance, metadata.propertyKey, {
				configurable: false,
				enumerable: true,
				get: () => this.resolve(metadata.token),
			});
		});

		return instance;
	}

	resolve<T>(token: symbol): T {
		console.debug('REsolving', token);

		if (this.#instances.has(token)) {
			return this.#instances.get(token);
		}

		if (this.#constants.has(token)) {
			// Console.debug('constant', Target);
			return this.#constants.get(token);
		}

		// Si encontramos una implementación registrada para el token (Symbol)
		if (this.#dependencies.has(token)) {
			const Implementation = this.#dependencies.get(token);

			if (!Implementation) {
				throw new Error(`No provider found for ${String(token)}`);
			}

			// Si la implementación es una clase, la instanciamos
			if (typeof Implementation === 'function') {
				const instance = this.#createInstance(Implementation) as T;
				this.#instances.set(token, instance);
				return instance;
			}

			// Si no es una clase, retornamos la implementación directamente
			return Implementation;
		}

		throw new Error(`No provider found for ${String(token)}`);
	}

	hasRegistration(token: symbol): boolean {
		return this.#dependencies.has(token) || this.#constants.has(token);
	}
}
