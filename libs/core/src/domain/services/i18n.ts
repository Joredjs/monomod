export type TLanguage = 'es' | 'en';

export interface ITextInfo {
	group: string;
	key: string;
	params?: (string | number)[];
	type: 'info' | 'error';
}

export interface IServiceI18n {
	getText(info: ITextInfo): string;
	getCurrentLanguage(): TLanguage;
	setLanguage(lang: TLanguage): void;
}

export interface ITranslations {
	[group: string]: {
		[type in 'info' | 'errors']: {
			[key: string]: {
				[lang in TLanguage]: string;
			};
		};
	};
}
