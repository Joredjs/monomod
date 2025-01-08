import 'reflect-metadata';

// Container.ts
export class Container {
	static #instance;

	#dependencies: Map<string, any> = new Map();

	#instances: Map<string, any> = new Map();

	#constants: Map<symbol, any> = new Map();

	static getInstance() {
		if (!Container.#instance) {
			Container.#instance = new Container();
		}
		return Container.#instance;
	}

	register(key: string, isntance: any) {
		this.#dependencies.set(key, isntance);
	}

	resolve<T>(InstanceKey: any): T {
		if (this.#constants.has(InstanceKey)) {
			return this.#constants.get(InstanceKey);
		}

		if (this.#instances.has(InstanceKey)) {
			return this.#instances.get(InstanceKey);
		}

		console.debug('resolving', InstanceKey);
		const paramTypes =
			Reflect.getMetadata('design:paramtypes', InstanceKey) || [];
		const resolvedDeps = paramTypes.map((token: any) =>
			this.resolve<any>(token)
		);
		const instance = new InstanceKey(...resolvedDeps);
		this.#instances.set(InstanceKey, instance);
		return instance;
	}

	public bind(token: symbol) {
		return {
			toConstantValue: (value: any) => {
				this.#constants.set(token, value);
			},
		};
	}
}
