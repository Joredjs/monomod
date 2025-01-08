import { Container } from './container';

export function Injectable() {
	return (target: any): void => {
		Container.getInstance().register(target, target);
	};
}

export function Inject(token: any) {
	return (target: any, propertyKey: string, parameterIndex: number) => {
		const params = Reflect.getMetadata('design:paramtypes', target) || [];
		params[parameterIndex] = token;
		Reflect.defineMetadata('design:paramtypes', params, target);
	};
}
