export type TTextKeys =
	| 'appsServerErrCreating'
	| 'appsServerErrStarting'
	| 'appsServerErrStoping'
	| 'appsServerMsgListening';
export type TLanguage = 'en' | 'es';

export enum ELanguages {
	EN = 'en',
	ES = 'es',
}

export type TLanguageText = {
	[key in TTextKeys]: {
		[lang in ELanguages]: string;
	};
};
