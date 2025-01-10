import { DIContainer } from './container';

export function Injectable(token: symbol) {
	// Console.debug('Injectable decorator called for token:', token.toString());
	return (target: any): void => {
		const container = DIContainer.getInstance();
		Reflect.defineMetadata('injectable', true, target);
		container.register(token, target);

		/* Reflect.defineMetadata('injectable', true, target);
		   DIContainer.getInstance().register(token, target); */
	};
}

export function Inject(token: symbol) {
	return (target: any, propertyKey: string, parameterIndex: number) => {
		const params = Reflect.getMetadata('design:paramtypes', target) || [];
		params[parameterIndex] = token;
		Reflect.defineMetadata('design:paramtypes', params, target);
	};
}
