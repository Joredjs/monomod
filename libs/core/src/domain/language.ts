type TTextKeys =
	| 'appsServerErrCreating'
	| 'appsServerErrStarting'
	| 'appsServerErrStoping'
	| 'appsServerMsgListening';
type TLanguage = 'en' | 'es';
type TLanguageText = {
	[key in TTextKeys]: {
		[lang in TLanguage]: string;
	};
};

const languageTexts: TLanguageText = {
	appsServerErrCreating: {
		en: 'Error creating the microapps',
		es: 'Error creando las microapps',
	},
	appsServerErrStarting: {
		en: 'Error starting the microapp $0',
		es: 'Error iniciando la microapp $0',
	},
	appsServerErrStoping: {
		en: 'MicroApp $0 has been stopped',
		es: 'La microapp $0 se ha detenido',
	},
	appsServerMsgListening: {
		en: 'MicroApp $0 listening at http://localhost:$1',
		es: 'Escuchando la microapp $0 en http://localhost:$1',
	},
};

function getValidLanguage(lang: string | undefined): TLanguage {
	const allowedLanguages: TLanguage[] = ['en', 'es'];

	if (allowedLanguages.includes(lang as TLanguage)) {
		return lang as TLanguage;
	}
	return 'en';
}

const selectedLanguage: TLanguage = getValidLanguage(process.env.LANGUAGE);
export function getLanguageTexts(
	key: TTextKeys,
	params: (string | number)[] = []
): string {
	const template = languageTexts[key][selectedLanguage];

	return template.replace(/\$(\d+)/g, (match, index) => {
		const idx = parseInt(index, 10);
		return params[idx] === undefined ? match : params[idx].toString();
	});
}
