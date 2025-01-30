import { IPortContainer } from './container.port';

export interface IPortRegistry {
	registerDependency(container: IPortContainer): void;
	getName(): string;
}
