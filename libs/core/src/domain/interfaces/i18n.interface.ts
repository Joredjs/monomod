import { EMessageGroup, EMessageType } from '../const';
import { TLanguage } from './language.interface';

export interface ITextInfo {
	group: EMessageGroup;
	key: string;
	params?: (string | number)[];
	type: EMessageType;
}

export type TTranslations = Record<
	EMessageGroup,
	Partial<
		Record<EMessageType, Partial<Record<string, Record<TLanguage, string>>>>
	>
>;
