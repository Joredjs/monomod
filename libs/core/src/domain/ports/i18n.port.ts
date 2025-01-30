import { ITextInfo, TLanguage } from '../interfaces';

export interface IPortI18n {
	getText(info: ITextInfo): string;
	getCurrentLanguage(): TLanguage;
	setLanguage(lang: TLanguage): void;
}
