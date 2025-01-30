import { IContainerComponent } from '../interfaces';

export interface IPortContainer {
	register(component: IContainerComponent): void;
	resolve<T>(token: symbol): T;
	hasRegistration(token: symbol): boolean;
}
