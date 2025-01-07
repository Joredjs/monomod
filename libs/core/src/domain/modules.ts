export type TDomainGroups = 'example';
export type TVersion = 'v1' | 'v2';

export enum EVersions {
	alpha = 'v1',
	beta = 'v2',
}

export enum EPrivacyLevel {
	public,
	user,
	admin,
}

export interface IDefaultToken {
	privacy: EPrivacyLevel;
	valid: number;
}
