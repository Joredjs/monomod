import { TVersion as THeadersVersion } from '../const';

interface IHeadersPrefixStructure {
	letter: string;
	prefix: string;
}
export type IHeadersPrefix = {
	[id in THeadersVersion]: IHeadersPrefixStructure;
};

export interface IHeadersStructure {
	desc: string;
	key: string;
	mandatory?: boolean;
	name?: string;
	prefix: IHeadersPrefixStructure;
	private?: boolean;
	values?: string[];
}

export interface IHeadersInfo {
	[id: string]: IHeadersStructure;
}

export interface IHeaderData {
	key: string;
	values: string[];
}

export interface IHeadersValues {
	[id: string]: string;
}
