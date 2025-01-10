import { TTextType } from './i18n';

export interface IMessageConfig {
	keys: { type: TTextType; key: string }[];
	group: string;
}
export interface IServiceMessages {
	getMessage(key: string, params: any[]): string;
}
