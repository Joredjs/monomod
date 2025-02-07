import { INJECT_METADATA_KEY, PropertyMetadata } from './metadata';
import { DIContainer } from './container';
import { IContainerComponent } from '../../domain';

export function Injectable(token: symbol) {
	// Console.debug('Injectable decorator called for token:', token.toString());
	return (target: any): void => {
		const container = DIContainer.getInstance();
		Reflect.defineMetadata(INJECT_METADATA_KEY, token, target);
		const component: IContainerComponent = {
			token,
			value: target,
		};
		container.register(component);
		return target;
	};
}

export function Inject(token: symbol) {
	return (
		target: any,
		propertyKey: string | symbol,
		parameterIndex?: number
	): void => {
		if (typeof parameterIndex === 'number') {
			// Constructor parameter injection
			const params = Reflect.getMetadata('design:paramtypes', target) || [];
			params[parameterIndex] = token;
			Reflect.defineMetadata('design:paramtypes', params, target);
		} else {
			// Property injection
			const existingMetadata: PropertyMetadata[] =
				Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];

			existingMetadata.push({ propertyKey, token });

			Reflect.defineMetadata(INJECT_METADATA_KEY, existingMetadata, target);
		}
	};
}
