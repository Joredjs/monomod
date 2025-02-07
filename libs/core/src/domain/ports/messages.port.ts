import { EMessageGroup } from '../const';

export interface IPortMessages {
	getMessage(key: string, params?: any[]): string;
	getContext(): EMessageGroup;
}
