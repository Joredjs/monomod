import {
	CipherCCM,
	CipherCCMTypes,
	DecipherCCM,
	createCipheriv,
	createDecipheriv,
	createHash,
	getCipherInfo,
	getCiphers,
	randomBytes,
} from 'crypto';

export const clientCrypto = {
	decrypt: createDecipheriv,
	encrypt: createCipheriv,
	getCiphers,
	getInfo: getCipherInfo,
	hash: createHash,
	random: randomBytes,
};

export type TTypesCrypto = {
	CCMCipher: CipherCCM;
	CCMDecipher: DecipherCCM;
	CCMTypes: CipherCCMTypes;
};
