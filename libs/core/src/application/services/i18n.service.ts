import {
	EMessageGroup,
	EMessageType,
	IPortI18n,
	ITextInfo,
	TLanguage,
	TOKENS,
	TRANSLATIONS,
} from '../../domain';
import { DEFAULTS } from '../../domain/const/defaults.const';
import { Injectable } from '../di';
import { normalizeError } from '../errors';

@Injectable(TOKENS.services.I18n)
export class ServiceI18n implements IPortI18n {
	#defaultLanguage: TLanguage = DEFAULTS.language;

	#currentLanguage: TLanguage;

	#translationCache = new Map<string, string>();

	constructor(selectedLanguage?: TLanguage) {
		this.#currentLanguage = this.#getValidLanguage(selectedLanguage);
	}

	#getValidLanguage(selectedLanguage?: TLanguage): TLanguage {
		const language =
			selectedLanguage || process.env.LANGUAGE || this.#defaultLanguage;

		const allowedLanguages: TLanguage[] = DEFAULTS.languages as TLanguage[];

		if (allowedLanguages.includes(language as TLanguage)) {
			return language as TLanguage;
		}
		return this.#defaultLanguage;
	}

	#getTranslation(info: ITextInfo): string {
		if (
			!TRANSLATIONS[info.group] ||
			!TRANSLATIONS[info.group][info.type] ||
			!TRANSLATIONS[info.group][info.type][info.key] ||
			!TRANSLATIONS[info.group][info.type][info.key][this.#currentLanguage]
		) {
			info = {
				group: EMessageGroup.SYSTEM,
				key: 'default',
				params: [info.group, info.type, info.key, ...info.params],
				type: EMessageType.INFO,
			};
		}

		const template =
			TRANSLATIONS[info.group]?.[info.type]?.[info.key]?.[
				this.#currentLanguage
			] || 'Error getting template message';

		return template.replace(/\$(\d+)/g, (match, index) => {
			const idx = parseInt(index, 10);
			return info.params[idx] === undefined
				? match
				: info.params[idx].toString();
		});

		/* Return template.replace(/\$(\d+)/g, (match, index) => {
		     const paramIndex = parseInt(index, 10);
		     if (paramIndex >= params.length) {
		       return match; // Mantener el placeholder si no hay parámetro
		     }
		     return String(params[paramIndex] ?? match);
		   }); */
	}

	getText(info: ITextInfo): string {
		try {
			// Return this.translations[this.currentLanguage]?.[params.group]?.[params.type]?.[params.key];
			const cacheKey = `${this.#currentLanguage}.${info.group}.${info.type}.${
				info.key
			}`;

			if (this.#translationCache.has(cacheKey)) {
				return this.#translationCache.get(cacheKey);
			}
			const translation = this.#getTranslation(info);
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
		this.#currentLanguage = this.#getValidLanguage(lang);
	}
}
