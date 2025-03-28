import {
	BinaryLike,
	CipherCCM,
	CipherCCMOptions,
	CipherCCMTypes,
	CipherInfo,
	CipherKey,
	DecipherCCM,
	Hash,
} from 'crypto';

export interface IPortCrypto {
	encrypt(texto: any): string;
	decrypt(encrypted: string): string;
}

//Is used any instead CipherCCM and DecipherCCM, because in the service it generate an error, cause the NodeJS.ArrayBufferView type
export interface IPortCryptoClient {
	decrypt(
		mode: CipherCCMTypes,
		key: CipherKey,
		vector: BinaryLike,
		options: CipherCCMOptions
	): any;
	encrypt(
		mode: CipherCCMTypes,
		key: CipherKey,
		vector: BinaryLike,
		options: CipherCCMOptions
	): any;
	getInfo(mode: CipherCCMTypes): CipherInfo;
	getCiphers(): string[];
	hash(hashType: string): Hash;
	random(size: number): Buffer;
}
