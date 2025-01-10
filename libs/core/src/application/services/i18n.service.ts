import { IServiceI18n, ITextInfo, TLanguage, domainKeys } from '../../domain';
import { normalizeError } from '../errors';

export class ServiceI18n implements IServiceI18n {
	#defaultLanguage: TLanguage = domainKeys.i18n.defaultLanguage as TLanguage;

	#currentLanguage: TLanguage;

	#translationCache = new Map<string, string>();

	constructor(selectedLanguage?: TLanguage) {
		// This.#currentLanguage = selectedLanguage || this.#defaultLanguage;
		this.#currentLanguage = this.#getValidLanguage();
	}

	#getValidLanguage(): TLanguage {
		const language = process.env.LANGUAGE || this.#defaultLanguage;

		const allowedLanguages: TLanguage[] = domainKeys.i18n
			.allowedLanguages as TLanguage[];

		if (allowedLanguages.includes(language as TLanguage)) {
			return language as TLanguage;
		}
		return this.#defaultLanguage;
	}

	#getTranslation(info: ITextInfo, language: TLanguage): string {
		const { translations } = domainKeys.i18n;

		if (
			!domainKeys.i18n.translations[info.group] ||
			!domainKeys.i18n.translations[info.group][info.type] ||
			!domainKeys.i18n.translations[info.group][info.type][info.key]
		) {
			info = {
				group: 'generic',
				key: 'default',
				params: [info.group, info.type, info.key, ...info.params],
				type: 'info',
			};
		}

		const template =
			translations[info.group]?.[info.type]?.[info.key]?.[language] ||
			'Error getting template message';

		return template.replace(/\$(\d+)/g, (match, index) => {
			const idx = parseInt(index, 10);
			return info.params[idx] === undefined
				? match
				: info.params[idx].toString();
		});
	}

	getText(info: ITextInfo): string {
		try {
			const cacheKey = `${info.group}.${info.type}.${info.key}.${
				this.#currentLanguage
			}`;

			if (this.#translationCache.has(cacheKey)) {
				return this.#translationCache.get(cacheKey);
			}
			const language: TLanguage = this.#getValidLanguage();
			const translation = this.#getTranslation(info, language);
			this.#translationCache.set(cacheKey, translation);
			return translation;
		} catch (error) {
			throw normalizeError({
				detail: error,
				errType: 'nocatch',
			});
		}
	}

	getCurrentLanguage(): TLanguage {
		return this.#currentLanguage;
	}

	setLanguage(lang: TLanguage): void {
		this.#currentLanguage = lang;
	}
}
