export type TLanguage = 'es' | 'en';

export type TTextType = 'info' | 'errors';

export interface ITextInfo {
	group: string;
	key: string;
	params?: (string | number)[];
	type: TTextType;
}

export interface IServiceI18n {
	getText(info: ITextInfo): string;
	getCurrentLanguage(): TLanguage;
	setLanguage(lang: TLanguage): void;
}

export interface ITranslations {
	[group: string]: {
		[type in TTextType]: {
			[key: string]: {
				[lang in TLanguage]: string;
			};
		};
	};
}
