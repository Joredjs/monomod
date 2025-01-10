import 'reflect-metadata';

// Container.ts
export class DIContainer {
	static #instance;

	#dependencies: Map<symbol, any> = new Map();

	#instances: Map<string, any> = new Map();

	#constants: Map<symbol, any> = new Map();

	static getInstance() {
		if (!DIContainer.#instance) {
			DIContainer.#instance = new DIContainer();
		}
		return DIContainer.#instance;
	}

	register(token: symbol, isntance: any, isConstant = false) {
		if (isConstant) {
			this.#constants.set(token, isntance);
			return;
		}

		const existing = this.#dependencies.get(token);

		if (existing && existing !== isntance) {
			throw new Error(
				`Token ${token.toString()} already has a different implementation registered`
			);
		}

		if (existing) {
			throw new Error(`Already registered ${token.toString()}`);
		} else {
			this.#dependencies.set(token, isntance);
			// Console.debug('registering', token);
		}
	}

	#createInstance(Target: symbol | any) {
		const Implementation = this.#dependencies.get(Target);

		if (!Implementation) {
			return null;
		}

		// Si la implementación es una clase, la instanciamos
		if (typeof Implementation === 'function') {
			// Console.debug('Implementation is a class', Implementation);
			const params =
				Reflect.getMetadata('design:paramtypes', Implementation) || [];
			const injections = params.map((param: any) => this.resolve(param));
			const instance = new Implementation(...injections);
			return instance;
		}

		// Si no es una clase, retornamos la implementación directamente
		return Implementation;
	}

	resolve<T>(Target: symbol | any): T {
		if (this.#instances.has(Target)) {
			return this.#instances.get(Target);
		}

		if (this.#constants.has(Target)) {
			// Console.debug('constant', Target);
			return this.#constants.get(Target);
		}

		// Si encontramos una implementación registrada para el token (Symbol)
		if (this.#dependencies.has(Target)) {
			const instance = this.#createInstance(Target);
			this.#instances.set(Target, instance);
			return instance;
		}

		throw new Error(`No provider found for ${String(Target)}`);
	}

	hasRegistration(token: symbol): boolean {
		return this.#dependencies.has(token) || this.#constants.has(token);
	}
}
