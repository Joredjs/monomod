import { IContainerComponent } from '../interfaces';

export interface IPortContainer {
	hasRegistration(token: symbol): boolean;
	register(component: IContainerComponent): void;
	resolve<T>(token: symbol): T;
}
